"""Learnly API - Flask backend for learning tools (summarise, quiz, chatbot, PDF loader)."""

import os

import fitz
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS

from utils.Model import MyModel
from utils.Quiz import Quiz
from utils.chabot import Chatbot
from utils.chroma import VectorEmbedding
from utils.pdf_loader import PDFScanner
from utils.summariser import Summariser
from utils.web_page_loader import CustomWebBaseLoader

app = Flask(__name__)
CORS(app,resources={r"/*": {"origins": "*"}})


def _success_response(message: str, response_data) -> tuple:
    """Return a 200 JSON response with message and data."""
    return make_response(
        jsonify({"message": message, "response": response_data}),
        200,
    )


def _error_response(error: Exception) -> tuple:
    """Return a 500 JSON response with error details."""
    return make_response(
        jsonify({"message": str(error), "response": str(error)}),
        500,
    )

@app.route("/", methods=["POST"])
def home():
    """Welcome endpoint."""
    return make_response(jsonify({"message": "Welcome to the Learnly API!"}), 200)


@app.route("/health", methods=["GET"])
def health_check():
    """Health check for Render deployment."""
    return make_response(
        jsonify({"status": "healthy", "message": "Learnly API is running"}),
        200,
    )


# Experiment Route
@app.route('/generate', methods=['POST'])
def generate():
    """Generate a response from raw prompt content."""
    try:
        data = request.get_json()
        llm = MyModel()
        result = llm.generate(structured_prompt=data["content"])
        return _success_response("Data received successfully", result)
    except Exception as e:
        return _error_response(e)


@app.route("/generate/summarise", methods=["POST"])
def generate_summarise():
    """Summarise content to a specified word count."""
    try:
        data = request.get_json()
        llm = Summariser()
        result = llm.generate(text=data["content"], size=data["size"])
        return _success_response("Data received successfully", result)
    except Exception as e:
        return _error_response(e)

# Quiz Route 
@app.route('/generate/quiz' , methods=['POST'])
def generate_quiz():
    """Generate a 5-question MCQ quiz from content."""
    try:
        data = request.get_json()
        llm = Quiz()
        result = llm.generate_quiz(content=data["content"], level=data["level"])
        return _success_response("Data received successfully", result)
    except Exception as e:
        return _error_response(e)


@app.route("/chat", methods=["POST"])
def chat():
    """Answer a question given context (chatbot)."""
    try:
        data = request.get_json()
        llm = Chatbot()
        result = llm.generate_response(
            question=data["question"],
            context=data["context"],
        )
        return _success_response("Data received successfully", result)
    except Exception as e:
        return _error_response(e)


@app.route("/generate/webloader", methods=["POST"])
def generate_webloader():
    """Load a web page and generate a summary."""
    try:
        data = request.get_json()
        loader = CustomWebBaseLoader()
        result = loader.get_response(url=data["content"])
        return _success_response("Data received successfully", result)
    except Exception as e:
        return _error_response(e)


@app.route("/load_pdf", methods=["POST"])
def load_pdf():
    """Load and extract text from a PDF URL."""
    try:
        data = request.get_json()
        pdf = PDFScanner()
        result = pdf.LoadPDF(data["content"])
        return _success_response("Data received successfully", str(result))
    except Exception as e:
        return _error_response(e)


@app.route("/load_pdf/ask", methods=["POST"])
def load_pdf_ask():
    """Load PDF, embed it, and answer questions about it."""
    try:
        data = request.get_json()
        pdf = PDFScanner()
        pdf_text = pdf.LoadPDF(data["content"])
        embedding = VectorEmbedding()
        embedding.insert_documents(documents=pdf_text)
        result = embedding.query_documents(data["question"])
        return _success_response("Data received successfully", result)
    except Exception as e:
        return make_response(
            jsonify({"message": str(e), "response": f"Error: {str(e)}"}),
            500,
        )


@app.route("/upload", methods=["POST"])
def upload_pdf():
    """Upload a PDF file and extract its text."""
    file = request.files["pdf"]
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = "".join(page.get_text() for page in doc)
    return make_response(jsonify({"text": text}), 200)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
    
