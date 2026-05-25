import { useState } from 'react'
import Modal from '../components/Modal'

const fraudAlerts = [
  { id: 'f1', user: 'Suspicious_User_23', type: 'Multiple Accounts', details: '3 accounts from same IP', risk: 'high', detected: '2026-05-19 10:30', status: 'open' },
  { id: 'f2', user: 'Fake_992', type: 'Fake Profile', details: 'AI detected synthetic photo', risk: 'high', detected: '2026-05-19 09:15', status: 'open' },
  { id: 'f3', user: 'Spam_Bot_45', type: 'Spam', details: 'Sending same message to 50+ users', risk: 'medium', detected: '2026-05-18 16:00', status: 'resolved' },
  { id: 'f4', user: 'User_8842', type: 'Unusual Login', details: 'Login from 3 different countries in 1 hour', risk: 'high', detected: '2026-05-18 14:00', status: 'open' },
  { id: 'f5', user: 'Coin_Farmer_7', type: 'Coin Farming', details: 'Abnormal coin earning pattern', risk: 'medium', detected: '2026-05-17 11:00', status: 'resolved' },
]

const flaggedContent = [
  { id: 'c1', user: 'User_1123', type: 'Abusive Language', confidence: '94%', room: 'Music Lovers', detected: '2026-05-19 12:30', status: 'flagged' },
  { id: 'c2', user: 'Troll_88', type: 'Hate Speech', confidence: '87%', room: 'Tech Talk', detected: '2026-05-19 11:00', status: 'flagged' },
  { id: 'c3', user: 'User_5567', type: 'Inappropriate Content', confidence: '96%', room: 'Chill Vibes', detected: '2026-05-18 22:00', status: 'reviewed' },
]

export default function Security() {
  const [alerts, setAlerts] = useState(fraudAlerts)
  const [tab, setTab] = useState('fraud')
  const [actionModal, setActionModal] = useState(null)

  const handleResolve = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: 'resolved' } : a))
    setActionModal(null)
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card"><div className="label">Open Alerts</div><div className="value" style={{ color: 'var(--danger)' }}>{alerts.filter((a) => a.status === 'open').length}</div></div>
        <div className="stats-card"><div className="label">High Risk</div><div className="value" style={{ color: 'var(--danger)' }}>{alerts.filter((a) => a.risk === 'high').length}</div></div>
        <div className="stats-card"><div className="label">Flagged Content</div><div className="value" style={{ color: 'var(--warning)' }}>{flaggedContent.filter((c) => c.status === 'flagged').length}</div></div>
        <div className="stats-card"><div className="label">Resolved Today</div><div className="value" style={{ color: 'var(--success)' }}>{alerts.filter((a) => a.status === 'resolved').length}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['fraud', 'content', 'suspicious'].map((t) => (
          <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
            {t === 'fraud' ? 'Fraud Detection' : t === 'content' ? 'AI Content Moderation' : 'Suspicious Logins'}
          </button>
        ))}
      </div>

      {tab === 'fraud' && (
        <div className="card">
          <div className="card-header">Fraud & Abuse Alerts</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>User</th><th>Type</th><th>Details</th><th>Risk</th><th>Detected</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {alerts.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 500 }}>{a.user}</td>
                      <td><span className="badge reported">{a.type}</span></td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.details}</td>
                      <td><span className={`badge ${a.risk === 'high' ? 'banned' : 'reported'}`}>{a.risk}</span></td>
                      <td>{a.detected}</td>
                      <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                      <td>
                        {a.status === 'open' && (
                          <button className="btn btn-success btn-sm" onClick={() => setActionModal(a)}>Resolve</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div className="card">
          <div className="card-header">AI Voice & Content Moderation</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>User</th><th>Type</th><th>AI Confidence</th><th>Room</th><th>Detected</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {flaggedContent.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 500 }}>{c.user}</td>
                      <td><span className="badge reported">{c.type}</span></td>
                      <td><span style={{ fontWeight: 600, color: parseInt(c.confidence) > 90 ? 'var(--danger)' : 'var(--warning)' }}>{c.confidence}</span></td>
                      <td>{c.room}</td>
                      <td>{c.detected}</td>
                      <td><span className={`badge ${c.status}`}>{c.status}</span></td>
                      <td><button className="btn btn-outline btn-sm">Review</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'suspicious' && (
        <div className="card">
          <div className="card-header">Suspicious Login Attempts</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>User</th><th>Location</th><th>Device</th><th>IP</th><th>Attempts</th><th>Last Attempt</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  <tr><td>User_8842</td><td>India, US, UK</td><td>iPhone 15</td><td style={{ fontFamily: 'monospace' }}>192.168.x.x</td><td>12 in 1hr</td><td>2026-05-19 14:30</td><td><button className="btn btn-warning btn-sm">Block</button></td></tr>
                  <tr><td>Unknown_Agent</td><td>Russia</td><td>Unknown</td><td style={{ fontFamily: 'monospace' }}>10.0.0.1</td><td>45 in 10min</td><td>2026-05-19 13:00</td><td><button className="btn btn-danger btn-sm">Block</button></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {actionModal && (
        <Modal title="Resolve Alert" onClose={() => setActionModal(null)}>
          <p>Resolve fraud alert for <strong>{actionModal.user}</strong>?</p>
          <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 8 }}>Type: {actionModal.type}<br />Details: {actionModal.details}</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
            <button className="btn btn-success" onClick={() => handleResolve(actionModal.id)}>Mark Resolved</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
