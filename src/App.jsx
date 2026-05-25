import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SidebarProvider } from './context/SidebarContext'
import { canAccessRoute } from './permissions'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Hosts from './pages/Hosts'
import Rooms from './pages/Rooms'
import Reports from './pages/Reports'
import Tickets from './pages/Tickets'
import DiamondCoin from './pages/DiamondCoin'
import Gifts from './pages/Gifts'
import Agency from './pages/Agency'
import CountryHandler from './pages/CountryHandler'
import DiamondStock from './pages/DiamondStock'
import HostPanel from './pages/HostPanel'
import LiveMonitor from './pages/LiveMonitor'
import Security from './pages/Security'
import Events from './pages/Events'
import Payments from './pages/Payments'
import Notifications from './pages/Notifications'
import Admins from './pages/Admins'
import Settings from './pages/Settings'

function ProtectedLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}

function ProtectedRoute({ children, required }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (required && !canAccessRoute(user, required)) {
    return (
      <ProtectedLayout>
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <h2 style={{ fontSize: 48, marginBottom: 12 }}>🚫</h2>
          <h3>Access Denied</h3>
          <p style={{ color: 'var(--text-light)', marginTop: 8 }}>You don't have permission to access this page.</p>
        </div>
      </ProtectedLayout>
    )
  }
  return <ProtectedLayout>{children}</ProtectedLayout>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute required="/"><Dashboard /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute required="/users"><Users /></ProtectedRoute>} />
      <Route path="/users/:id" element={<ProtectedRoute required="/users/"><UserDetail /></ProtectedRoute>} />
      <Route path="/hosts" element={<ProtectedRoute required="/hosts"><Hosts /></ProtectedRoute>} />
      <Route path="/rooms" element={<ProtectedRoute required="/rooms"><Rooms /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute required="/reports"><Reports /></ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute required="/tickets"><Tickets /></ProtectedRoute>} />
      <Route path="/diamond-coin" element={<ProtectedRoute required="/diamond-coin"><DiamondCoin /></ProtectedRoute>} />
      <Route path="/gifts" element={<ProtectedRoute required="/gifts"><Gifts /></ProtectedRoute>} />
      <Route path="/agency" element={<ProtectedRoute required="/agency"><Agency /></ProtectedRoute>} />
      <Route path="/country" element={<ProtectedRoute required="/country"><CountryHandler /></ProtectedRoute>} />
      <Route path="/diamond-stock" element={<ProtectedRoute required="/diamond-stock"><DiamondStock /></ProtectedRoute>} />
      <Route path="/host-panel" element={<ProtectedRoute required="/host-panel"><HostPanel /></ProtectedRoute>} />
      <Route path="/live" element={<ProtectedRoute required="/live"><LiveMonitor /></ProtectedRoute>} />
      <Route path="/security" element={<ProtectedRoute required="/security"><Security /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute required="/events"><Events /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute required="/payments"><Payments /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute required="/notifications"><Notifications /></ProtectedRoute>} />
      <Route path="/admins" element={<ProtectedRoute required="/admins"><Admins /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute required="/settings"><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
