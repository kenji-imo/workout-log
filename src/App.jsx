import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Home from './pages/Home'
import CalendarPage from './pages/CalendarPage'
import RecordPage from './pages/RecordPage'
import GraphPage from './pages/GraphPage'
import ProfilePage from './pages/ProfilePage'
import ProfileSetup from './pages/ProfileSetup'
import LoginPage from './pages/LoginPage'
import FriendsPage from './pages/FriendsPage'
import TabBar from './components/TabBar'
import './App.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [isSetup, setIsSetup] = useState(() => {
    return localStorage.getItem('isProfileSetup') === 'true'
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingSession(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loadingSession) {
    return (
      <div style={{
        minHeight: '100vh', background: '#1A1A2E',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
      }}>
        読み込み中...
      </div>
    )
  }

  if (!session) {
    return <LoginPage />
  }

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
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </div>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}
