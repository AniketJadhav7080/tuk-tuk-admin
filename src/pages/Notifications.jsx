import { useState } from 'react'
import Modal from '../components/Modal'

export default function Notifications() {
  const [type, setType] = useState('notification')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('all')
  const [schedule, setSchedule] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [history] = useState([
    { id: '1', type: 'notification', title: 'Server Maintenance Tonight', audience: 'all', status: 'sent', date: '2026-05-19 10:30', reads: 12430 },
    { id: '2', type: 'announcement', title: 'New Voice Filters Available!', audience: 'all', status: 'sent', date: '2026-05-18 14:00', reads: 8920 },
    { id: '3', type: 'promo', title: 'VIP 50% Off This Week', audience: 'vip', status: 'scheduled', date: '2026-05-22 09:00', reads: 0 },
    { id: '4', type: 'notification', title: 'Update Your Profile', audience: 'inactive', status: 'sent', date: '2026-05-17 08:00', reads: 3402 },
  ])

  const handleSend = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
    setTitle('')
    setMessage('')
    setSchedule('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">{type === 'notification' ? 'Send Push Notification' : type === 'announcement' ? 'Broadcast Announcement' : 'Promotional Banner'}</div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { key: 'notification', label: 'Push Notification' },
              { key: 'announcement', label: 'Announcement' },
              { key: 'promo', label: 'Promo Banner' },
            ].map((t) => (
              <button key={t.key} className={`btn btn-sm ${type === t.key ? 'btn-primary' : 'btn-outline'}`} onClick={() => setType(t.key)}>{t.label}</button>
            ))}
          </div>

          <form onSubmit={handleSend}>
            <div className="form-group">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title..." required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, minHeight: 100, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Audience</label>
                <select value={audience} onChange={(e) => setAudience(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                  <option value="all">All Users</option>
                  <option value="active">Active Users</option>
                  <option value="vip">VIP Users</option>
                  <option value="inactive">Inactive Users</option>
                  <option value="banned">Banned Users</option>
                </select>
              </div>
              <div className="form-group">
                <label>Schedule (optional)</label>
                <input type="datetime-local" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? 'Sending...' : schedule ? 'Schedule' : 'Send Now'}
              </button>
              {sent && <span style={{ color: 'var(--success)', fontSize: 13 }}>✓ {schedule ? 'Scheduled!' : 'Sent successfully!'}</span>}
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Notification History ({history.length})</div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Audience</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Reads</th>
                </tr>
              </thead>
              <tbody>
                {history.map((n) => (
                  <tr key={n.id}>
                    <td><span className="badge reported" style={{ textTransform: 'capitalize' }}>{n.type}</span></td>
                    <td style={{ fontWeight: 500 }}>{n.title}</td>
                    <td>{n.audience}</td>
                    <td><span className={`badge ${n.status}`}>{n.status}</span></td>
                    <td>{n.date}</td>
                    <td>{n.reads.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
