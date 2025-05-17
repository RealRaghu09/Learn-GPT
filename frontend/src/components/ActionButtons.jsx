import React, { useState } from 'react'
import './ActionButtons.css'
import Quiz from './Quiz.jsx'
import Summary from './Summary.jsx'
import Chatbot from './Chatbot.jsx'

export default function ActionButtons() {
  const [activeComponent, setActiveComponent] = useState(null)

  const handleClick_for_Quiz = () => {
    setActiveComponent('quiz')
  }

  const handleClick_for_Summary = () => {
    setActiveComponent('summary')
  }

  const handleClick_for_Chatbot = () => {
    setActiveComponent('chatbot')
  }

  // Render the active component or buttons
  return (
    <div className="action-buttons-container ">
      {!activeComponent ? (
        <>
          <button className="action-button" onClick={handleClick_for_Quiz}>
            Quiz Generator
          </button>
          <button className="action-button" onClick={handleClick_for_Summary}>
            Summary
          </button>
          <button className="action-button" onClick={handleClick_for_Chatbot}>
            ChatBot
          </button>
        </>
      ) : (
        // Render the selected component
        {
          'quiz': <Quiz />,
          'summary': <Summary />,
          'chatbot': <Chatbot />
        }[activeComponent]
      )}
    </div>
  )
}