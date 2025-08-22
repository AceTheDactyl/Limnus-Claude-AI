import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'))
const Agents = React.lazy(() => import('./pages/Agents/Agents'))
const Patterns = React.lazy(() => import('./pages/Patterns/Patterns'))
const Nodes = React.lazy(() => import('./pages/Nodes/Nodes'))
const Resonance = React.lazy(() => import('./pages/Resonance/Resonance'))
const Admin = React.lazy(() => import('./pages/Admin/Admin'))
const Login = React.lazy(() => import('./pages/Auth/Login'))

function AppRoutes() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/resonance" element={<Resonance />} />
          {user.groups.includes('admin') && (
            <Route path="/admin" element={<Admin />} />
          )}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App