import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'
import { hasPermission, PERMISSIONS, ROLES } from '../permissions'

const allLinks = [
  { to: '/', label: 'Dashboard', icon: '📊', perm: PERMISSIONS.VIEW_DASHBOARD },
  { to: '/users', label: 'Users', icon: '👥', perm: PERMISSIONS.VIEW_USERS },
  { to: '/hosts', label: 'Hosts', icon: '⭐', perm: PERMISSIONS.VIEW_HOSTS },
  { to: '/rooms', label: 'Rooms', icon: '🎙️', perm: PERMISSIONS.MONITOR_ROOMS },
  { to: '/reports', label: 'Reports', icon: '⚠️', perm: PERMISSIONS.VIEW_REPORTS },
  { to: '/tickets', label: 'Tickets', icon: '🎫', perm: PERMISSIONS.VIEW_TICKETS },
  { to: '/diamond-coin', label: 'Diamond & Coin', icon: '💎', perm: PERMISSIONS.MANAGE_DIAMOND },
  { to: '/gifts', label: 'Gifts', icon: '🎁', perm: PERMISSIONS.MANAGE_GIFTS },
  { to: '/agency', label: 'Agency', icon: '🏢', perm: PERMISSIONS.MANAGE_AGENCY },
  { to: '/country', label: 'Country', icon: '🌍', perm: PERMISSIONS.VIEW_COUNTRY_DASHBOARD },
  { to: '/diamond-stock', label: 'Diamond Stock', icon: '💠', perm: PERMISSIONS.VIEW_DIAMOND_DASHBOARD },
  { to: '/host-panel', label: 'Host Panel', icon: '🎤', perm: PERMISSIONS.VIEW_HOST_DASHBOARD },
  { to: '/live', label: 'Live Monitor', icon: '🔴', perm: PERMISSIONS.LIVE_MONITORING },
  { to: '/security', label: 'Security', icon: '🔒', perm: PERMISSIONS.VIEW_SECURITY },
  { to: '/events', label: 'Events', icon: '🎉', perm: PERMISSIONS.MANAGE_EVENTS },
  { to: '/payments', label: 'Payments', icon: '💳', perm: PERMISSIONS.MANAGE_PAYMENTS },
  { to: '/notifications', label: 'Notifications', icon: '🔔', perm: PERMISSIONS.SEND_NOTIFICATIONS },
  { to: '/admins', label: 'Admins', icon: '🛡️', perm: PERMISSIONS.MANAGE_ADMINS },
  { to: '/settings', label: 'Settings', icon: '⚙️', perm: PERMISSIONS.VIEW_SETTINGS },
]

export default function Sidebar() {
  const { user } = useAuth()
  const { open, close } = useSidebar()
  const visibleLinks = allLinks.filter((l) => hasPermission(user, l.perm))

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={close} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-logo">
        <span>🎧</span>
        <span>Tuk-Tuk</span>
      </div>
      <nav className="sidebar-nav">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            onClick={close}
          >
            <span className="icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      </aside>
    </>
  )
}
