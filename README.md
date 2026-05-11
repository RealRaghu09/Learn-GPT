# Learnly GPT

## Project Overview

Learnly GPT is an AI-powered learning assistant that transforms traditional PDF reading into an interactive learning experience using Generative AI and Retrieval-Augmented Generation (RAG).

The platform allows users to upload PDFs, PDF links, or custom context and converts the content into:

- 📘 AI Generated Summaries
- 🧠 Interactive Quizzes
- 💬 Context-Aware Chat Interface

The system ensures that responses are generated without losing the original document context using semantic search and vector embeddings.

---

#  Problems Observed to make this project

Many students and professionals struggle to read and fully understand large PDFs or documentation files.

Common problems include:

- Losing interest while reading lengthy documents
- Missing important concepts
- Difficulty in searching relevant information
- Passive reading leading to poor retention
- Lack of interaction with learning materials

Learnly GPT solves this by converting static PDFs into an intelligent and interactive AI learning system.

---

# Features

-  Upload PDF Files
-  Upload PDF Links
-  Provide Custom Context
-  AI-Powered Chat with Documents
-  Automatic Summary Generation
-  Interactive Quiz Generation
-  Semantic Search using Vector Embeddings
-  Fast and Scalable Backend APIs

---

# Tech Stack

## Frontend
- React.js
- Vite
- JavaScript

## Backend
- FastAPI
- Python

## AI & ML Frameworks
- LangChain
- LangGraph
- Gemini API

## Database & Storage
- ChromaDB (Vector Database)

## Document Processing
- PDFLoader

---

# Architecture

```text
User Input (PDF / PDF Link / Context)
                |
                V
          PDF Extraction
                |
                V
           Text Chunking
                |
                V
       Embedding Generation
                |
                V
     ChromaDB Vector Storage
                |
                V
      Retrieval-Augmented Generation
                |
                V
  Summary | Quiz | AI Chat Responses (Reasoning is done here while creating)

  ## Future Integrations 
    - Add the Top Youtube Video as the source 
    - Add the PPT Feature 
    - take source from web and reddit