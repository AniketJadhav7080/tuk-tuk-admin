import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { hasPermission, PERMISSIONS } from '../permissions'
import Modal from '../components/Modal'

const defaultHosts = [
  { id: 'h1', name: 'DJ Ravi', email: 'ravi@tuktuk.com', status: 'active', followers: 12430, earnings: '$4,280', gifts: 845, pkWins: 32, pkLosses: 8, agency: 'Star Agency', rating: 4.8, joined: '2026-01-15' },
  { id: 'h2', name: 'Singer Priya', email: 'priya@tuktuk.com', status: 'active', followers: 8920, earnings: '$3,150', gifts: 612, pkWins: 21, pkLosses: 12, agency: 'Star Agency', rating: 4.6, joined: '2026-02-20' },
  { id: 'h3', name: 'Comedy King', email: 'comedy@tuktuk.com', status: 'pending', followers: 3450, earnings: '$980', gifts: 210, pkWins: 8, pkLosses: 5, agency: 'Fun Agency', rating: 4.2, joined: '2026-04-10' },
  { id: 'h4', name: 'DJ Alex', email: 'alex@tuktuk.com', status: 'banned', followers: 2100, earnings: '$1,200', gifts: 156, pkWins: 5, pkLosses: 15, agency: 'None', rating: 3.9, joined: '2026-01-01' },
  { id: 'h5', name: 'Neha Melody', email: 'neha@tuktuk.com', status: 'active', followers: 18700, earnings: '$6,800', gifts: 1240, pkWins: 45, pkLosses: 10, agency: 'Top Voice Agency', rating: 4.9, joined: '2025-12-01' },
]

export default function Hosts() {
  const { user } = useAuth()
  const [hosts, setHosts] = useState(defaultHosts)
  const [search, setSearch] = useState('')
  const [actionModal, setActionModal] = useState(null)
  const [actionType, setActionType] = useState('')

  const canApprove = hasPermission(user, PERMISSIONS.APPROVE_HOSTS)

  const handleAction = (type, host) => {
    setActionType(type)
    setActionModal(host)
  }

  const performAction = () => {
    if (actionType === 'approve') {
      setHosts((prev) => prev.map((h) => h.id === actionModal.id ? { ...h, status: 'active' } : h))
    } else if (actionType === 'ban') {
      setHosts((prev) => prev.map((h) => h.id === actionModal.id ? { ...h, status: h.status === 'banned' ? 'active' : 'banned' } : h))
    }
    setActionModal(null)
  }

  const filtered = hosts.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) || h.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card"><div className="label">Total Hosts</div><div className="value">{hosts.length}</div></div>
        <div className="stats-card"><div className="label">Active</div><div className="value" style={{ color: 'var(--success)' }}>{hosts.filter((h) => h.status === 'active').length}</div></div>
        <div className="stats-card"><div className="label">Pending</div><div className="value" style={{ color: 'var(--warning)' }}>{hosts.filter((h) => h.status === 'pending').length}</div></div>
        <div className="stats-card"><div className="label">Total Followers</div><div className="value">{hosts.reduce((s, h) => s + h.followers, 0).toLocaleString()}</div></div>
      </div>

      <div className="card">
        <div className="card-header">Host Management ({hosts.length})</div>
        <div className="card-body">
          <div className="search-bar">
            <input placeholder="Search hosts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Followers</th>
                  <th>Earnings</th>
                  <th>Gifts</th>
                  <th>PK (W/L)</th>
                  <th>Rating</th>
                  <th>Agency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 500 }}>{h.name}</td>
                    <td>{h.email}</td>
                    <td><span className={`badge ${h.status}`}>{h.status}</span></td>
                    <td>{h.followers.toLocaleString()}</td>
                    <td>{h.earnings}</td>
                    <td>{h.gifts}</td>
                    <td>{h.pkWins}/{h.pkLosses}</td>
                    <td>⭐ {h.rating}</td>
                    <td>{h.agency}</td>
                    <td>
                      <div className="actions">
                        {h.status === 'pending' && canApprove && (
                          <button className="btn btn-success btn-sm" onClick={() => handleAction('approve', h)}>Approve</button>
                        )}
                        {canApprove && (
                          <button className={`btn btn-sm ${h.status === 'banned' ? 'btn-success' : 'btn-warning'}`} onClick={() => handleAction('ban', h)}>
                            {h.status === 'banned' ? 'Unban' : 'Ban'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {actionModal && (
        <Modal title={actionType === 'approve' ? 'Approve Host' : `${actionType === 'ban' && actionModal.status === 'banned' ? 'Unban' : 'Ban'} Host`} onClose={() => setActionModal(null)}>
          <p>Are you sure you want to {actionType === 'approve' ? 'approve' : actionModal.status === 'banned' ? 'unban' : 'ban'} <strong>{actionModal.name}</strong>?</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
            <button className={`btn ${actionType === 'approve' ? 'btn-success' : 'btn-danger'}`} onClick={performAction}>
              {actionType === 'approve' ? 'Approve' : actionModal.status === 'banned' ? 'Unban' : 'Ban'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
