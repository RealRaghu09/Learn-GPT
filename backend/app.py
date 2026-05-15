"""Learnly API - FastAPI backend for learning tools."""

import os
from typing import Any, Literal
import fitz

from fastapi import Depends, FastAPI, UploadFile, File, HTTPException, Request, BackgroundTasks
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from utils.ppt_generator import PPTModel, ppt
from utils.Model import MyModel
from utils.Quiz import Quiz
from utils.chatbot import Chatbot
from utils.chroma import VectorEmbedding
from utils.pdf_loader import PDFScanner
from utils.summariser import Summariser
from utils.web_page_loader import CustomWebBaseLoader

from pyrate_limiter import Duration, Limiter, Rate


app = FastAPI()

# CORS and add rate limiter 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def rate_limit_dependency(limiter: Limiter, *, key_prefix: str):
    async def _dep(request: Request):
        host = request.client.host if request.client else "unknown"
        bucket_key = f"{key_prefix}:{host}"
        allowed = limiter.try_acquire(name=bucket_key, blocking=False)
        if not allowed:
            raise HTTPException(status_code=429, detail="Too Many Requests")

    return _dep


_limiter_2_per_5s = Limiter(Rate(2, Duration.SECOND * 5))
_limiter_2_per_10s = Limiter(Rate(2, Duration.SECOND * 10))
_limiter_2_per_20s = Limiter(Rate(2, Duration.SECOND * 20))


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1)
    context: str = Field("", description="Optional context used to answer the question")

TargetAudience = Literal["students", "educators", "executives", "general"]
PresentationStyle = Literal["minimal", "detailed", "storytelling", "data_driven"]
PPTLayout = Literal["normal", "modern", "creative", "retro"]
PPTLanguage = Literal["English", "Spanish", "French", "Hindi", "German", "Japanese"]
PPTTone = Literal["formal", "casual", "persuasive", "neutral", "inspirational"]
SummaryLevel = Literal["brief", "standard", "detailed"]
PPTTheme = Literal["black", "white"]


class PPTRequest(BaseModel):
    target_audience: TargetAudience = "general"
    num_slides: str = "8"
    presentation_style: PresentationStyle = "minimal"
    include_images: bool = True
    include_charts: bool = False
    language: PPTLanguage = "English"
    tone: PPTTone = "neutral"
    summary_level: SummaryLevel = "standard"
    theme: PPTTheme = "black"
    layout: PPTLayout = "modern"
    data: Any = Field(default="", description="Source material from the studio context")


class PPTGenerateBody(BaseModel):
    content: PPTRequest


def _topic_from_studio_data(data: Any) -> str:
    if isinstance(data, str) and data.strip():
        first = data.strip().split("\n", 1)[0].strip().lstrip("#").strip()
        return first[:300] if first else "Presentation"
    return "Presentation"


def _generate_ppt_sync(req: PPTRequest) -> dict:
    """Runs LLM + ppt generation in a worker thread (blocking)."""
    topic = _topic_from_studio_data(req.data)
    try:
        slides_int = int(str(req.num_slides).strip())
    except ValueError:
        slides_int = 10
    slides_int = max(2, min(50, slides_int))

    llm = PPTModel()
    ppt_obj = ppt()

    raw_topics = llm.generate_title_of_slides(topic, slides_int)
    cleaned = [t.strip() for t in raw_topics if t and str(t).strip()]
    needed_titles = max(0, slides_int - 1)
    if len(cleaned) < needed_titles:
        cleaned.extend(
            f"Section {i + 1}" for i in range(len(cleaned), needed_titles)
        )
    list_of_topics = cleaned[:needed_titles]

    list_of_content = llm.generate_content_of_topics(
        subtopics=list_of_topics,
        tone=req.tone,
        depth=req.presentation_style,
        no_of_slides=slides_int,
        TargetAudience=req.target_audience,
        SlideCount=slides_int,
        presentationStyle=req.presentation_style,
        PPTLang=req.language,
        PPTTone=req.tone,
        SummaryLevel=req.summary_level,
        PPTTheme=req.theme,
    )

    color_scheme = ["white", "black"] if req.theme == "black" else ["black", "white"]
    font_style = ["Arial", "Calibri"]
    layout = req.layout
    include_images = req.include_images

    if layout == "normal":
        response = ppt_obj.generate_normal_ppt(
            topic,
            list_of_content,
            list_of_topics,
            slides_int,
            color_scheme,
            font_style,
            include_images=include_images,
        )
    elif layout == "creative":
        response = ppt_obj.generate_creative_ppt(
            topic, list_of_content, list_of_topics, slides_int, include_images=include_images
        )
    elif layout == "retro":
        response = ppt_obj.generate_retro_ppt(
            topic, list_of_content, list_of_topics, slides_int, include_images=include_images
        )
    else:
        response = ppt_obj.generate_modern_ppt(
            topic, list_of_content, list_of_topics, slides_int, include_images=include_images
        )

    if hasattr(llm, "warnings") and llm.warnings:
        response["warnings"] = llm.warnings
    return response


def success_response(message: str, response_data):
    return {
        "message": message,
        "response": response_data
    }


@app.post("/")
async def home():
    return {"message": "Welcome to the Learnly API!"}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Learnly API is running"
    }


@app.post("/generate")
async def generate(data: dict):
    try:
        llm = MyModel()
        result = await run_in_threadpool(llm.generate, structured_prompt=data["content"])
        return success_response("Data received successfully", result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/generate/summarise",
    dependencies=[Depends(rate_limit_dependency(_limiter_2_per_5s, key_prefix="summarise"))],
)
async def generate_summarise(data: dict):
    try:
        llm = Summariser()
        result = await run_in_threadpool(llm.generate, text=data["content"], size=data["size"])
        return success_response("Data received successfully", result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate/quiz",
    dependencies=[Depends(rate_limit_dependency(_limiter_2_per_5s, key_prefix="quiz"))],
)
async def generate_quiz(data: dict):
    try:
        llm = Quiz()
        result = await run_in_threadpool(
            llm.generate_quiz,
            content=data["content"],
            level=data["level"],
        )
        return success_response("Data received successfully", result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/chat",
    dependencies=[Depends(rate_limit_dependency(_limiter_2_per_5s, key_prefix="chat"))],
)
async def chat(data: ChatRequest):
    try:
        llm = Chatbot()
        result = await run_in_threadpool(
            llm.generate_response,
            question=data.question,
            context=data.context,
        )
        return success_response("Data received successfully", result)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate/webloader")
async def generate_webloader(data: dict):
    try:
        loader = CustomWebBaseLoader()
        result = await run_in_threadpool(loader.get_response, url=data["content"])
        return success_response("Data received successfully", result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/load_pdf",
    dependencies=[Depends(rate_limit_dependency(_limiter_2_per_10s, key_prefix="load_pdf"))],
)
async def load_pdf(data: dict):
    try:
        pdf = PDFScanner()
        result = pdf.LoadPDF(data["content"])
        return success_response("Data received successfully", str(result))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/load_pdf/ask",
    )
async def load_pdf_ask(data: dict):
    try:
        pdf = PDFScanner()
        pdf_text = await run_in_threadpool(pdf.LoadPDF, data["content"])

        embedding = VectorEmbedding()
        await run_in_threadpool(embedding.insert_documents, documents=pdf_text)

        result = await run_in_threadpool(embedding.query_documents, data["question"])

        return success_response("Data received successfully", result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/upload",
    dependencies=[Depends(rate_limit_dependency(_limiter_2_per_20s, key_prefix="upload"))],)
async def upload_pdf(pdf: UploadFile = File(...)):
    try:
        contents = await pdf.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = "".join(page.get_text() for page in doc)

        return {"text": text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/generate_ppt",
    dependencies=[Depends(rate_limit_dependency(_limiter_2_per_10s, key_prefix="generate_ppt"))],
)
async def generate_ppt(body: PPTGenerateBody, background_tasks: BackgroundTasks):
    file_path = None
    try:
        response = await run_in_threadpool(_generate_ppt_sync, body.content)
        file_path = response.get("file_path", "")
        if not file_path:
            raise HTTPException(status_code=500, detail="PPT generation did not return a file path")
        
        # Ensure file exists before attempting to send
        if not os.path.isfile(file_path):
            raise HTTPException(status_code=500, detail=f"Generated presentation file not found at {file_path}")
        
        headers = {}
        warnings = response.get("warnings")
        if warnings:
            headers["X-Learnly-Warning"] = " | ".join(str(w).replace("\n", " ") for w in warnings)
        
        # Schedule file cleanup after response is sent
        background_tasks.add_task(os.remove, file_path)
        return FileResponse(
            file_path,
            filename="presentation.pptx",
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers=headers,
        )
    except HTTPException:
        raise
    except Exception as e:
        # Clean up file if it exists and generation failed
        if file_path and os.path.isfile(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
        raise HTTPException(status_code=500, detail=str(e))
