import { createContext, useContext, useState, useEffect } from 'react'
import { ROLES } from '../permissions'

const AuthContext = createContext(null)

const mockAdmins = [
  { id: '1', name: 'Super Admin', email: 'super@tuktuk.com', role: ROLES.SUPER_ADMIN },
  { id: '2', name: 'Moderator', email: 'mod@tuktuk.com', role: ROLES.MODERATOR },
  { id: '3', name: 'Support Staff', email: 'support@tuktuk.com', role: ROLES.SUPPORT },
  { id: '4', name: 'Country Handler - India', email: 'country@tuktuk.com', role: ROLES.COUNTRY_HANDLER },
  { id: '5', name: 'Diamond Stock Manager', email: 'diamond@tuktuk.com', role: ROLES.DIAMOND_STOCK },
  { id: '6', name: 'Agency Manager', email: 'agency@tuktuk.com', role: ROLES.AGENCY },
  { id: '7', name: 'Host Star', email: 'host@tuktuk.com', role: ROLES.HOST },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allAdmins, setAllAdmins] = useState(mockAdmins)

  useEffect(() => {
    setUser(mockAdmins[0])
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const found = mockAdmins.find((a) => a.email === email) || mockAdmins[0]
    setUser(found)
    return { user: found, token: 'mock-token' }
  }

  const logout = () => setUser(null)

  const switchRole = (adminId) => {
    const found = allAdmins.find((a) => a.id === adminId)
    if (found) setUser(found)
  }

  const addAdmin = (admin) => {
    const newAdmin = { ...admin, id: String(Date.now()) }
    setAllAdmins((prev) => [...prev, newAdmin])
    return newAdmin
  }

  const removeAdmin = (id) => {
    setAllAdmins((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, allAdmins, switchRole, addAdmin, removeAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
