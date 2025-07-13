import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { useData } from '../context/DataContext'
import { API_ENDPOINTS } from '../config/api'

export default function Chatbot() {
  const userSectionRef = useRef(null);
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { finalData } = useData()

  const scrollToUser = () => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

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
      "question": question,
      "context": finalData
    };

    try {
      const res = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      const responseContent = responseData['response']
      setSummary(responseContent)
      console.log("Final Summary ", responseContent)

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatResponse = (text) => {
    // Remove any leading/trailing whitespace
    let formatted = text.trim();

    // Replace multiple spaces with single space
    formatted = formatted.replace(/\s+/g, ' ');

    // Remove any special characters at the start/end
    formatted = formatted.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

    // Add proper spacing after punctuation
    formatted = formatted.replace(/([.,!?])([a-zA-Z])/g, '$1 $2');

    // Capitalize first letter of each sentence
    formatted = formatted.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());

    return formatted;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data = {
        "question": input,
        "context": finalData
      };

      const res = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      const responseContent = responseData['response'];

      // Format the response before displaying
      const formattedResponse = formatResponse(responseContent);

      // Add bot response
      const botMessage = { text: formattedResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage = { text: "Sorry, I encountered an error. Please try again.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <button onClick={scrollToUser}>
        Down
      </button>
      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}