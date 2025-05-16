import React, { useState } from 'react'
import './Quiz.css'

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [CurrentScore , setCurrentScore] = useState(0)
  // Sample questions array - replace with your actual questions
  const questions = [
    {
      question: "What is React?",
      options: [
        "A JavaScript library",
        "A database",
        "A programming language",
        "An operating system"
      ],
      correct: 0
    }
    // Add more questions here
  ]

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  return (
    <div className="quiz-container flex">
        <div>
            <span>
                Score : {CurrentScore}
            </span>
        </div>
      <div className="question-section">
        <h2>Question {currentQuestion + 1}</h2>
        <p>{questions[currentQuestion].question}</p>
      </div>

      <div className="options-grid">
        {questions[currentQuestion].options.map((option, index) => (
          <button key={index} className="option-button">
            {option}
          </button>
        ))}
      </div>

      <button className="next-button" onClick={handleNext}>
        Next Question
      </button>
    </div>
  )
}