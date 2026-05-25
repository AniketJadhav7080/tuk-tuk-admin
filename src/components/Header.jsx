import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'
import { hasPermission, PERMISSIONS } from '../permissions'

const roleColors = {
  super_admin: { bg: '#8b5cf6', label: 'Super Admin', defaultRoute: '/' },
  moderator: { bg: '#0a7ea4', label: 'Moderator', defaultRoute: '/' },
  support: { bg: '#27ae60', label: 'Support', defaultRoute: '/' },
  country_handler: { bg: '#e67e22', label: 'Country Handler', defaultRoute: '/country' },
  diamond_stock: { bg: '#1abc9c', label: 'Diamond Stock', defaultRoute: '/diamond-stock' },
  agency: { bg: '#e74c3c', label: 'Agency', defaultRoute: '/agency' },
  host: { bg: '#f39c12', label: 'Host', defaultRoute: '/host-panel' },
}

export default function Header() {
  const { user, logout, allAdmins, switchRole } = useAuth()
  const { toggle } = useSidebar()
  const navigate = useNavigate()
  const roleInfo = roleColors[user?.role] || { bg: '#6b7280', label: user?.role }

  const handleSwitch = (e) => {
    const selected = allAdmins.find((a) => a.id === e.target.value)
    switchRole(e.target.value)
    const route = roleColors[selected?.role]?.defaultRoute || '/'
    navigate(route)
  }

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="hamburger" onClick={toggle}>☰</button>
        <h1>Admin Panel</h1>
        <span className="role-badge" style={{ background: roleInfo.bg }}>{roleInfo.label}</span>
      </div>
      <div className="header-right">
        {hasPermission(user, PERMISSIONS.MANAGE_ADMINS) && (
          <select className="role-switcher" value={user?.id} onChange={handleSwitch}>
            {allAdmins.map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({roleColors[a.role]?.label || a.role})</option>
            ))}
          </select>
        )}
        <span style={{ fontSize: 14, color: 'var(--text-light)' }}>{user?.email}</span>
        <div className="admin-avatar" style={{ background: roleInfo.bg }}>{user?.name?.charAt(0) || 'A'}</div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  )
}
