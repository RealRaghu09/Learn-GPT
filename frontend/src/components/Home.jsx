import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import Quiz from "../images/quizes.png"
import Chat from "../images/chat.png"
import Summary from "../images/summary.png"
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Welcome to Learnly</h1>
        <h2 className="hero-subtitle">Your AI-powered Learning Companion</h2>
        <p className="hero-description">
          Learnly helps you learn smarter with AI-driven summaries, quizzes, and interactive chat. Upload documents, get instant insights, and test your knowledge—all in one place.
          Learnly GPT is an AI-powered educational assistant that takes text resources (like PDFs or plain text) and turns them into interactive learning material.

It’s not just a PDF reader — it actually understands the content and gives learners useful outputs like:
</p>
<p>
  <div style={{
    textAlign:"left"
  }}>

✅ Quizzes
  </div>
<div style={{
  textAlign:"left"
}}>

✅ Summaries
</div>
<div style={{
  textAlign:"left"
}}>

✅ A chatbot that answers questions from the content
</div>
<div style={{
  textAlign:"left"
}}>

✅ Indexing
<div style={{paddingTop:"18px"}}>
The system intelligently processes the provided content, understands the context, and enables users to interact with it through natural language. Instead of passively reading, learners can actively ask questions, receive clear explanations, and explore concepts in depth.

Learnly GPT also generates concise summaries and practice questions to help users revise faster and reinforce their understanding. By leveraging modern language models and retrieval-based techniques, the platform ensures responses are accurate, context-aware, and relevant to the source material.

This project aims to make learning more efficient, engaging, and accessible by combining artificial intelligence with real-world educational workflows.
</div>
</div>
        </p>
        <button className="get-started-btn" onClick={() => navigate('/upload_pdf')}>
          Get Started
        </button>
      </section>
      <section className="image-showcase">
        <div className="image-grid">
          <img src={Quiz} alt="Quizes" style={{
             width: "300px",
             height:"auto",
             objectFit: "cover"
          }}/>
          <img src={Chat} alt="Chat Interface with Bot" style={{
             width: "400px",
             height:"auto",
             objectFit: "cover"
          }}/>
          <img src={Summary} alt="Summary" style={{
             width: "400px",
             height:"auto",
             objectFit: "cover"
          }}/>
        </div>
      </section>
    </div>
  );
}
