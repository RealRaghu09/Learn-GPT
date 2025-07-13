import React ,{useEffect , useState} from 'react';
import './Summary.css';
import { useData } from '../context/DataContext';
import { API_ENDPOINTS } from '../config/api';

export default function Summary() {
  const {finalData} = useData();
  const [summary, setSummary] = useState(''); // Add state for summary
  
  const handleButtonClick = async (action) => {
    console.log(`${action} button clicked`);
    let size = action // for Sending json
    // console.log(size)
    console.log(finalData)
    if (!finalData) {
      console.log('Please provide a Context');
      return;
    }
  
    const data = {
      "content":finalData,
      "size": size
    };
  
    try {
      const res = await fetch(API_ENDPOINTS.SUMMARIZE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
    
      const responseData = await res.json();
      const responseContent = responseData['response']
      setSummary(responseContent)
      console.log("Final Summary ",responseContent)
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
      <div className="summary-container">
      <div className="summary-content">
        <h2>Learning Summary</h2>
        
        <div className="summary-section">
          {summary ? (
            <>
              <h2>Generated Summary</h2>
              <p>{summary}</p>
            </>
          ) : (
            <>
              <h2>Instructions:-</h2>
              <ul>
                <h5><li>Click Short for Short Summary</li></h5>
                <h5><li>Click Medium for Medium Summary</li></h5>
                <h5><li>Click Long for Large Deatiled Summary</li></h5>
              </ul>
            </>
          )}
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