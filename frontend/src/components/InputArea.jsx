import React from 'react'
import './InputArea.css'

export default function InputArea() {
  return (
    <div className="input-container">
      <input 
        type="text" 
        name="InputLink" 
        id="InputLink" 
        className="input-field"
        placeholder='Link of PDF'
      />
      <div className="separator">
        <span>OR</span>
      </div>
      <textarea 
        name="InputContext"
        id="InputContext" 
        className="textarea-field"
        placeholder='Context'
        rows="6"
      />
      <button className='submit-response'>Submit</button>
    </div>
  )
}
