import { useState } from 'react'
import Modal from '../components/Modal'

const defaultTickets = [
  { id: 'tk1', user: 'Rahul Sharma', subject: 'Payment not received', category: 'Payment', priority: 'high', status: 'open', assignee: 'Support Staff', date: '2026-05-19 14:30', messages: 4 },
  { id: 'tk2', user: 'Priya Singh', subject: 'Account hacked', category: 'Security', priority: 'urgent', status: 'open', assignee: '-', date: '2026-05-19 12:00', messages: 2 },
  { id: 'tk3', user: 'Ahmed Khan', subject: "Can't join voice room", category: 'Technical', priority: 'medium', status: 'in_progress', assignee: 'Support Staff', date: '2026-05-18 16:00', messages: 6 },
  { id: 'tk4', user: 'Sara Ali', subject: 'Wrong coin deduction', category: 'Billing', priority: 'low', status: 'resolved', assignee: 'Support Staff', date: '2026-05-17 10:00', messages: 3 },
  { id: 'tk5', user: 'Neha Patel', subject: 'Harassment report', category: 'Abuse', priority: 'urgent', status: 'open', assignee: '-', date: '2026-05-19 09:00', messages: 1 },
]

const chatMessages = [
  { from: 'User', text: 'I have been trying to withdraw my earnings but it keeps failing.', time: '14:30' },
  { from: 'Support', text: 'I understand. Can you please share your transaction ID?', time: '14:32' },
  { from: 'User', text: 'Here it is: TXN-2026-05-19-0042', time: '14:35' },
  { from: 'Support', text: 'Thank you. Let me check this for you.', time: '14:36' },
]

export default function Tickets() {
  const [tickets, setTickets] = useState(defaultTickets)
  const [filter, setFilter] = useState('all')
  const [chatModal, setChatModal] = useState(null)
  const [chatInput, setChatInput] = useState('')

  const filtered = tickets.filter((t) => filter === 'all' || t.status === filter)
  const openCount = tickets.filter((t) => t.status === 'open').length

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatInput('')
  }

  const handleAssign = (ticket) => {
    setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status: 'in_progress', assignee: 'Support Staff' } : t))
  }

  const handleResolve = (ticket) => {
    setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status: 'resolved' } : t))
    setChatModal(null)
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card"><div className="label">Total Tickets</div><div className="value">{tickets.length}</div></div>
        <div className="stats-card"><div className="label">Open</div><div className="value" style={{ color: 'var(--danger)' }}>{openCount}</div></div>
        <div className="stats-card"><div className="label">In Progress</div><div className="value" style={{ color: 'var(--warning)' }}>{tickets.filter((t) => t.status === 'in_progress').length}</div></div>
        <div className="stats-card"><div className="label">Resolved</div><div className="value" style={{ color: 'var(--success)' }}>{tickets.filter((t) => t.status === 'resolved').length}</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'open', 'in_progress', 'resolved'].map((f) => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
                {f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>User</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Messages</th><th>Assignee</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.user}</td>
                    <td>{t.subject}</td>
                    <td><span className="badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>{t.category}</span></td>
                    <td><span className={`badge ${t.priority === 'urgent' ? 'banned' : t.priority === 'high' ? 'reported' : 'inactive'}`}>{t.priority}</span></td>
                    <td><span className={`badge ${t.status === 'open' ? 'reported' : t.status === 'in_progress' ? 'pending' : 'active'}`}>{t.status.replace('_', ' ')}</span></td>
                    <td>{t.messages}</td>
                    <td>{t.assignee}</td>
                    <td>{t.date}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-primary btn-sm" onClick={() => setChatModal(t)}>Chat</button>
                        {t.status === 'open' && <button className="btn btn-warning btn-sm" onClick={() => handleAssign(t)}>Assign</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {chatModal && (
        <Modal title={`Ticket: ${chatModal.subject}`} onClose={() => setChatModal(null)}>
          <div style={{ marginBottom: 16, maxHeight: 250, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'Support' ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>{m.from} • {m.time}</span>
                <div style={{ background: m.from === 'Support' ? 'var(--primary-light)' : '#f3f4f6', padding: '8px 12px', borderRadius: 12, maxWidth: '80%', fontSize: 13 }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }} />
            <button type="submit" className="btn btn-primary btn-sm">Send</button>
          </form>
          <div className="modal-actions" style={{ marginTop: 12 }}>
            <button className="btn btn-outline" onClick={() => setChatModal(null)}>Close</button>
            {chatModal.status !== 'resolved' && (
              <button className="btn btn-success" onClick={() => handleResolve(chatModal)}>Mark Resolved</button>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
