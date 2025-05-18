## LEARN-GPT
this is the Webpage is built on top of Vite + React with JS Serving as Frontend and Flask as Backend with use of Langchain and RAG , I have built the application that takes a input either the pdf link or the content  sent to the RAG to create the vector Embeddings and 
to Provide accurate Answers to the User from the Given Contexts

## Tech Stack 
--- Vite + React (Frontend)  - JavaScript
--- Flask (Backend) - Python
--- LangChain  (Frontier Model) - Python 
--- PDFLoader - Python 
--- RAG Vector Database Chroma DB (to store the Data in terms of Vectors of 1534 dimensions ) - Python 

## Features 
-- Personlized Quiz :- it generates the Personlised Quiz from the Context either from PDF or TextBox With difficulties 
|--- Easy :- Generates the Easy Level Quiz 
|--- Medium :- Generates the Medium Level Quiz
|--- Hard :- Generates the Hard Level Quiz

-- ChatBot :- it generates Personlised Chat Experience from the Context either from PDF or TextBox Using Vector DB(Chroma)
|--- It can answer the Question from Context for accurate answers 
 
-- Summary Type :- it generates Personlised Summary from the Context either from PDF or TextBox with score feature 
|--- Shortest as possible Summary for high Level understanding 
|--- Medium as Possible Summary for high level and Understandable Summary
|--- Long for Detailed Summary for Detailed Summary
