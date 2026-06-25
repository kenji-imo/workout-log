import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import CalendarPage from './pages/CalendarPage'
import RecordPage from './pages/RecordPage'
import GraphPage from './pages/GraphPage'
import ProfilePage from './pages/ProfilePage'
import ProfileSetup from './pages/ProfileSetup'
import TabBar from './components/TabBar'
import './App.css'

export default function App() {
  const [isSetup, setIsSetup] = useState(() => {
    return localStorage.getItem('isProfileSetup') === 'true'
  })

  if (!isSetup) {
    return <ProfileSetup onComplete={() => setIsSetup(true)} />
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/record" element={<RecordPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}