import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { BobsCornView } from '@/views/BobsCornView'
import { LoginView } from '@/views/LoginView'
import { DashboardView } from '@/views/DashboardView'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<BobsCornView />} />
          <Route path="/login" element={<LoginView />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardView />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
