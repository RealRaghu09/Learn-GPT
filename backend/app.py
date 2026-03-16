"""Learnly API - FastAPI backend for learning tools."""

import os
import fitz

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware

from utils.Model import MyModel
from utils.Quiz import Quiz
from utils.chatbot import Chatbot
from utils.chroma import VectorEmbedding
from utils.pdf_loader import PDFScanner
from utils.summariser import Summariser
from utils.web_page_loader import CustomWebBaseLoader

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.post("/generate/summarise")
async def generate_summarise(data: dict):
    try:
        llm = Summariser()
        result = await run_in_threadpool(llm.generate, text=data["content"], size=data["size"])
        return success_response("Data received successfully", result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate/quiz")
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


@app.post("/chat")
async def chat(data: dict):
    try:
        llm = Chatbot()
        result = await run_in_threadpool(
            llm.generate_response,
            question=data["question"],
            context=data["context"],
        )
        return success_response("Data received successfully", result)
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


@app.post("/load_pdf")
async def load_pdf(data: dict):
    try:
        pdf = PDFScanner()
        result = pdf.LoadPDF(data["content"])
        return success_response("Data received successfully", str(result))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/load_pdf/ask")
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


@app.post("/upload")
async def upload_pdf(pdf: UploadFile = File(...)):
    try:
        contents = await pdf.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = "".join(page.get_text() for page in doc)

        return {"text": text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


