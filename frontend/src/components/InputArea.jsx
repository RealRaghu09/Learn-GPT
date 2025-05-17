import React, { useState ,useEffect } from 'react'
import './InputArea.css'

export default function InputArea() {
  const [pdfLink, setPdfLink] = useState('');
  const [context, setContext] = useState('');
  const [linkError, setLinkError] = useState('');

  const validatePdfLink = (link) => {
    if (!link) return true;
    
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    
    if (!urlPattern.test(link)) {
      setLinkError('Please enter a valid URL');
      return false;
    }
    
    if (!link.toLowerCase().endsWith('.pdf')) {
      setLinkError('URL must point to a PDF file');
      return false;
    }

    setLinkError('');
    return true;
  };

  const handleLinkChange = (e) => {
    const link = e.target.value;
    setPdfLink(link);
    if (link) {
      validatePdfLink(link);
    } else {
      setLinkError('');
    }
  };

  const handleContextChange = (e) => {
    setContext(e.target.value);
  };

  const handleSubmit = async () => {
    if (!pdfLink && !context) {
      setLinkError('Please provide either a PDF link or context');
      return;
    }

    if (pdfLink && !validatePdfLink(pdfLink)) {
      return;
    }
    console.log('PDF Link:', pdfLink);
    console.log('Context:', context);
    const data = { "content": pdfLink, "type": "pdf" };

    try {
      const res = await fetch('http://localhost:8000/load_pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      // setResponse(JSON.stringify(result));
      console.log(result.message)
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="input-container">
      <div className="input-wrapper">
        <input 
          type="text" 
          name="InputLink" 
          id="InputLink" 
          className={`input-field ${linkError ? 'error' : ''}`}
          placeholder='Link of PDF'
          value={pdfLink}
          onChange={handleLinkChange}
        />
        {linkError && <span className="error-message">{linkError}</span>}
      </div>
      <div className="separator">
        <span>OR</span>
      </div>
      <textarea 
        name="InputContext"
        id="InputContext" 
        className="textarea-field"
        placeholder='Context'
        rows="6"
        value={context}
        onChange={handleContextChange}
      />
      <button 
        className='submit-response'
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  )
}