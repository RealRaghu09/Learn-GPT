import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-icon">🚫</div>
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Page Not Found</h2>
        <p className="notfound-description">Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link to={'/'}>
          <button className="notfound-btn">Go to Home</button>
        </Link>
      </div>
    </div>
  )
}
