import React from 'react';
import './Summary.css';

export default function Summary() {
  const handleButtonClick = (action) => {
    console.log(`${action} button clicked`);
    let size = action // for Sending json
    // console.log(size)
  };

  return (
    <div className="summary-container">
      <div className="summary-content">
        <h2>Learning Summary</h2>
        
        

        <div className="summary-section">
          <h3>Key Points</h3>
          <ul>
            <li>React Components and Props</li>
            <li>State Management</li>
            <li>React Hooks</li>
            <li>API Integration</li>
          </ul>
        </div>

        <div className="summary-section">
          <h3>Next Steps</h3>
          <p>Continue with advanced React concepts and practical projects.</p>
        </div>

        <div className="button-container">
          <button 
            className="summary-button"
            onClick={() => handleButtonClick('Short')}
          >
            Short
          </button>
          <button 
            className="summary-button"
            onClick={() => handleButtonClick('Medium')}
          >
            Medium
          </button>
          <button 
            className="summary-button"
            
            onClick={() => handleButtonClick('Long')}
          >
            Long
          </button>
        </div>
      </div>
    </div>
  );
}