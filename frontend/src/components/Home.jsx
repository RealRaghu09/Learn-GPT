import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Welcome to Learnly</h1>
        <h2 className="hero-subtitle">Your AI-powered Learning Companion</h2>
        <p className="hero-description">
          Learnly helps you learn smarter with AI-driven summaries, quizzes, and interactive chat. Upload documents, get instant insights, and test your knowledge—all in one place.
        </p>
        <button className="get-started-btn" onClick={() => navigate('/upload_pdf')}>
          Get Started
        </button>
      </section>
      <section className="image-showcase">
        <h3>Project Screenshots</h3>
        <div className="image-grid">
          <img src="/images/screenshot1.png" alt="Screenshot 1" />
          <img src="/images/screenshot2.png" alt="Screenshot 2" />
          <img src="/images/screenshot3.png" alt="Screenshot 3" />
        </div>
      </section>
    </div>
  );
}
