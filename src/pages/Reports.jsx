import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import { api } from '../services/api'
const defaultReports = [
  { id: '1', reporter: 'User_8842', reported: 'Ahmed Khan', reason: 'Harassment', detail: 'Using abusive language in room', room: 'Gaming Zone 🎮', status: 'pending', date: '2026-05-19' },
  { id: '2', reporter: 'User_1123', reported: 'Mike_99', reason: 'Spam', detail: 'Sending inappropriate messages in DMs', room: 'N/A', status: 'pending', date: '2026-05-19' },
  { id: '3', reporter: 'User_5567', reported: 'John Doe', reason: 'Fake Profile', detail: 'Using someone else\'s photos', room: 'Chill Vibes', status: 'resolved', date: '2026-05-18' },
  { id: '4', reporter: 'User_2234', reported: 'Alex_007', reason: 'Inappropriate Content', detail: 'Sharing NSFW content in voice chat', room: 'Music Lovers 🎵', status: 'pending', date: '2026-05-19' },
  { id: '5', reporter: 'User_9981', reported: 'Sam_2026', reason: 'Impersonation', detail: 'Pretending to be admin', room: 'Tech Talk', status: 'pending', date: '2026-05-18' },
]
export default function Reports() {
  const [reports, setReports] = useState(defaultReports)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [resolveModal, setResolveModal] = useState(null)
  useEffect(() => {
    api.getReports()
      .then((data) => { if (data?.reports) setReports(data.reports) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])
  const handleResolve = async (report) => {
    try {
      await api.resolveReport(report.id)
      setReports((prev) => prev.map((r) => r.id === report.id ? { ...r, status: 'resolved' } : r))
      setResolveModal(null)
    } catch { setResolveModal(null) }
  }
  const filtered = reports.filter((r) => filter === 'all' || r.status === filter)
  const pendingCount = reports.filter((r) => r.status === 'pending').length
  if (loading) return <Loading />
  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card">
          <div className="label">Total Reports</div>
          <div className="value">{reports.length}</div>
        </div>
        <div className="stats-card">
          <div className="label">Pending</div>
          <div className="value" style={{ color: 'var(--warning)' }}>{pendingCount}</div>
        </div>
        <div className="stats-card">
          <div className="label">Resolved</div>
          <div className="value" style={{ color: 'var(--success)' }}>{reports.length - pendingCount}</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'pending', 'resolved'].map((f) => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Reporter</th>
                  <th>Reported User</th>
                  <th>Reason</th>
                  <th>Details</th>
                  <th>Room</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.reporter}</td>
                    <td style={{ fontWeight: 500 }}>{r.reported}</td>
                    <td><span className="badge reported">{r.reason}</span></td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.detail}</td>
                    <td>{r.room}</td>
                    <td>{r.date}</td>
                    <td><span className={`badge ${r.status}`}>{r.status}</span></td>
                    <td>
                      {r.status === 'pending' && (
                        <button className="btn btn-success btn-sm" onClick={() => setResolveModal(r)}>Resolve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {resolveModal && (
        <Modal title="Resolve Report" onClose={() => setResolveModal(null)}>
          <p>Mark this report against <strong>{resolveModal.reported}</strong> as resolved?</p>
          <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 8 }}>
            Reason: {resolveModal.reason} — {resolveModal.detail}
          </p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setResolveModal(null)}>Cancel</button>
            <button className="btn btn-success" onClick={() => handleResolve(resolveModal)}>Mark Resolved</button>
          </div>
        </Modal>
      )}
    </div>
  )
}