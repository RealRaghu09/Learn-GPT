import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import InputArea from './components/InputArea'
import ActionButtons from './components/ActionButtons'
import { DataProvider } from './context/DataContext'

function App() {
  return (
    <DataProvider>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <InputArea />
          <ActionButtons />
        </div>
      </div>
    </DataProvider>
  )
}

export default App
