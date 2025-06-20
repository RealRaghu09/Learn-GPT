import React, { useState } from 'react'
import './ActionButtons.css'
import Quiz from './Quiz.jsx'
import Summary from './Summary.jsx'
import Chatbot from './Chatbot.jsx'

export default function ActionButtons() {
  // Use a stack to keep track of navigation history
  const [componentStack, setComponentStack] = useState([])

  const handleClick_for_Quiz = () => {
    setComponentStack((prev) => [...prev, 'quiz'])
  }

  const handleClick_for_Summary = () => {
    setComponentStack((prev) => [...prev, 'summary'])
  }

  const handleClick_for_Chatbot = () => {
    setComponentStack((prev) => [...prev, 'chatbot'])
  }

  const handleBack = () => {
    setComponentStack((prev) => prev.slice(0, -1))
  }

  const activeComponent = componentStack[componentStack.length - 1] || null

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
        <>
          <button className="action-button back-button" onClick={handleBack} style={{width:40 , justifyContent:'center', alignItems:'center' , display:'inline-flex'
    }}>
            Back
          </button>
          {{
            'quiz': <Quiz />,
            'summary': <Summary />,
            'chatbot': <Chatbot />
          }[activeComponent]}
        </>
      )}
    </div>
  )
}