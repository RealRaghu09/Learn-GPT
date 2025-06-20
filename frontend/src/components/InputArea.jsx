import React, { useState, useEffect } from 'react'
import './InputArea.css'
import { useData } from '../context/DataContext'

export default function InputArea() {
  const [pdfLink, setPdfLink] = useState('');
  const [context, setContext] = useState('');
  const [linkError, setLinkError] = useState('');
  const [result, setResult] = useState(null);
  const { finalData, setFinalData } = useData();
  const [pdf_data, setPdf_data] = useState("");
  const [uploadStatus, setUploadStatus] = useState('');

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
    if (!pdfLink) {
      setLinkError('Please provide a PDF link');
      return;
    }

    if (!validatePdfLink(pdfLink)) {
      return;
    }

    const data = {
      "content": pdfLink,
      "type": "pdf"
    };

    try {
      const res = await fetch('http://localhost:8000/load_pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
    
      const responseData = await res.json();
      setResult(responseData);
      setPdf_data(responseData.response);
      const newFinalData = responseData.response || context;
      setFinalData(newFinalData);
      console.log("Final Data:", finalData, "Source:", responseData.response ? "PDF" : "Context");
      
    } catch (error) {
      console.error('Error:', error);
    }
};
const handleContextSubmit = async () => {
  if (!context) {
    setLinkError('Please provide context');
    return;
  }
  
  const data = { 
    "content": context, 
    "type": "text" 
  };
  
  try {
      const res = await fetch('http://localhost:8000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
    
      const responseData = await res.json();
      setResult(responseData);
      const newFinalData = pdf_data || context;
      setFinalData(newFinalData);
      console.log("Final Data:", responseData, "Source:", pdf_data ? "PDF" : "Context");
      
    } catch (error) {
      console.error('Error:', error);
    }
};
const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setUploadStatus('Uploading...');
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Extracted text:", result.text);
    setUploadStatus('Done!');
    setFinalData(result.text || '');
  } catch (error) {
    setUploadStatus('Error uploading PDF');
    console.error('Upload error:', error);
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
      <button 
      className='submit-response'
      onClick={handleSubmit}
      disabled={result !== null}
    >
      {result ? 'Submitted' : 'Submit'}
    </button>
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
      onClick={handleContextSubmit}
      disabled={result !== null}
    >
      {result ? 'Submitted' : 'Context submit'}
    </button>
    <div className="separator">
        <span>OR</span>
      </div>
      <div className='file-upload'>
      <input type="file" accept="application/pdf" onChange={handleUpload} className='file-input' />
      </div>
      {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
    </div>
  )
}