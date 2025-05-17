import React, { useState } from 'react'
import './Quiz.css'
import { useData } from '../context/DataContext'

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [currentScore, setCurrentScore] = useState(0)
  const [showGenerate, setShowGenerate] = useState(false)
  const [difficulty, setDifficulty] = useState(null)
  const [apiQuestions, setApiQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const { finalData } = useData()

  const fetchQuestions = async (difficultyLevel) => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('Sending request with:', {
        content: finalData,
        level: difficultyLevel
      })

      const response = await fetch('http://localhost:8000/generate/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "content": finalData,
          "level": difficultyLevel
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.message}`)
      }
      
      const data = await response.json()
      const QuestionSet = data['response'] 
      console.log('API Response:', typeof(QuestionSet))
      
      if (!data.response) {
        throw new Error('API returned invalid response format')
      }

      // Convert Python dictionary string to valid JSON
      const jsonString = JSON.parse(QuestionSet)
         // Remove leading/trailing whitespace

      console.log('Converted JSON string:', jsonString);
      const parsedResponse = (jsonString);
      console.log('Parsed Response:', parsedResponse)
      
      // Transform the API response into our question format
      const formattedQuestions = []
      for (let i = 1; i <= 5; i++) {
        const question = {
          question: parsedResponse[`question_${i}`],
          options: [
            parsedResponse[`question_${i}_option_1`],
            parsedResponse[`question_${i}_option_2`],
            parsedResponse[`question_${i}_option_3`],
            parsedResponse[`question_${i}_option_4`]
          ],
          correct: parsedResponse[`correct_answer_${i}`]
        }
        console.log(`Formatted Question ${i}:`, question)
        formattedQuestions.push(question)
      }
      
      console.log('All Formatted Questions:', formattedQuestions)
      setApiQuestions(formattedQuestions)
      setDifficulty(difficultyLevel)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setError(error.message)
      setDifficulty(null) // Reset difficulty to allow retrying
    }
    setIsLoading(false)
  }

  const handleOptionClick = (option) => {
    if (showAnswer) return; // Prevent multiple selections
    
    setSelectedOption(option);
    setShowAnswer(true);
    
    if (option === apiQuestions[currentQuestion].correct) {
      setCurrentScore(prevScore => prevScore + 1);
    }
  };

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < apiQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setShowAnswer(false);
      if (nextQuestion === apiQuestions.length - 1) {
        setShowGenerate(true);
      }
    }
  };

  const handleGenerate = () => {
    setCurrentQuestion(0)
    setCurrentScore(0)
    setShowGenerate(false)
    setDifficulty(null)
    setApiQuestions([])
  }

  if (error) {
    return (
      <div className="quiz-container flex">
        <div className="error-message">
          <h2>Error Loading Questions</h2>
          <p>{error}</p>
          <button 
            className="difficulty-button" 
            onClick={() => setError(null)}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!difficulty) {
    return (
      <div className="quiz-container flex">
        <h2 className="Title">Select Difficulty Level</h2>
        <div className="difficulty-buttons">
          <button onClick={() => fetchQuestions('easy')} className="difficulty-button">
            Easy
          </button>
          <button onClick={() => fetchQuestions('medium')} className="difficulty-button">
            Medium
          </button>
          <button onClick={() => fetchQuestions('hard')} className="difficulty-button">
            Hard
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="quiz-container">Loading questions...</div>
  }

  // Add safety check
  if (!apiQuestions.length || !apiQuestions[currentQuestion]) {
    return <div className="quiz-container">No questions available</div>
  }

  return (
    <div className="quiz-container flex">
      <div className='scoreTitle'>
        <span>
          Score: {currentScore}
        </span>
      </div>
      <div className="question-section">
        <h2>Question {currentQuestion + 1}</h2>
        <p>{apiQuestions[currentQuestion].question}</p>
      </div>

      <div className="options-grid">
        {apiQuestions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              showAnswer
                ? option === apiQuestions[currentQuestion].correct
                  ? 'correct'
                  : option === selectedOption
                  ? 'incorrect'
                  : ''
                : selectedOption === option
                ? 'selected'
                : ''
            }`}
            onClick={() => handleOptionClick(option)}
            disabled={showAnswer}
          >
            {option}
          </button>
        ))}
      </div>

      {showAnswer && (
        showGenerate ? (
          <button className="generate-button" onClick={handleGenerate}>
            Generate Results
          </button>
        ) : (
          <button className="next-button" onClick={handleNext}>
            Next Question
          </button>
        )
      )}
    </div>
  )
}