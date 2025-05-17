import React, { useState } from 'react'
import './Quiz.css'

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [CurrentScore , setCurrentScore] = useState(0)
    const [showGenerate, setShowGenerate] = useState(false)

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
    },
    {
      question : "Hi 2",
      options : [
        "A",
        "B",
        "C",
        "D"
      ]
    },
    {
      question: "What is React?",
      options: [
        "A JavaScript library",
        "A database",
        "A programming language",
        "An operating system"
      ],
      correct: 0
    },
    {
      question: "What is React?",
      options: [
        "A JavaScript library",
        "A database",
        "A programming language",
        "An operating system"
      ],
      correct: 0
    },
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
  ]
const handleNext = () => {
    const nextQuestion = currentQuestion + 1;
    console.log('Current Question:', currentQuestion);
    console.log('Questions Length:', questions.length);
    console.log('Show Generate:', showGenerate);
    
    if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        if (nextQuestion === questions.length - 1) {
            setShowGenerate(true);
        }
    }
}

  const handleGenerate = () => {
    console.log('Generate results')
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

      {showGenerate ? (
        <button className="generate-button" onClick={handleGenerate}>
          Generate Results
        </button>
      ) : (
        <button className="next-button" onClick={handleNext}>
          Next Question
        </button>
      )}
    </div>
  )
}