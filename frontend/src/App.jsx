import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import InputArea from './components/InputArea'
import ActionButtons from './components/ActionButtons'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <InputArea />
        <ActionButtons />
      </div>
    </div>
  )
}

export default App
