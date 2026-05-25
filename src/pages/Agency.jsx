import { useState } from 'react'
import Modal from '../components/Modal'

const defaultAgencies = [
  { id: 'a1', name: 'Star Agency', manager: 'Vikram Patel', hosts: 24, activeHosts: 18, totalEarnings: '$84,500', commission: '$12,675', salaryPaid: '$8,400', rating: 4.7, status: 'active', joined: '2025-06-01' },
  { id: 'a2', name: 'Fun Agency', manager: 'Riya Kapoor', hosts: 15, activeHosts: 10, totalEarnings: '$42,300', commission: '$6,345', salaryPaid: '$4,200', rating: 4.3, status: 'active', joined: '2025-08-15' },
  { id: 'a3', name: 'Top Voice Agency', manager: 'Arjun Singh', hosts: 32, activeHosts: 28, totalEarnings: '$128,000', commission: '$19,200', salaryPaid: '$14,000', rating: 4.9, status: 'active', joined: '2025-03-01' },
  { id: 'a4', name: 'New Talent Agency', manager: 'Sneha Reddy', hosts: 5, activeHosts: 2, totalEarnings: '$8,200', commission: '$1,230', salaryPaid: '$600', rating: 3.8, status: 'pending', joined: '2026-05-01' },
]

export default function Agency() {
  const [agencies, setAgencies] = useState(defaultAgencies)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('agencies')
  const [showRecruit, setShowRecruit] = useState(false)
  const [recruitForm, setRecruitForm] = useState({ hostName: '', hostEmail: '', commission: '15' })

  const handleRecruit = (e) => {
    e.preventDefault()
    setShowRecruit(false)
    setRecruitForm({ hostName: '', hostEmail: '', commission: '15' })
  }

  const filtered = agencies.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))

  const commissionsData = [
    { host: 'DJ Ravi', agency: 'Star Agency', commission: '15%', earned: '$4,280', agencyShare: '$642', paid: 'Yes' },
    { host: 'Singer Priya', agency: 'Star Agency', commission: '12%', earned: '$3,150', agencyShare: '$378', paid: 'Yes' },
    { host: 'Neha Melody', agency: 'Top Voice Agency', commission: '15%', earned: '$6,800', agencyShare: '$1,020', paid: 'Pending' },
  ]

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card"><div className="label">Total Agencies</div><div className="value">{agencies.length}</div></div>
        <div className="stats-card"><div className="label">Total Hosts</div><div className="value">{agencies.reduce((s, a) => s + a.hosts, 0)}</div></div>
        <div className="stats-card"><div className="label">Active Hosts</div><div className="value">{agencies.reduce((s, a) => s + a.activeHosts, 0)}</div></div>
        <div className="stats-card"><div className="label">Total Commission</div><div className="value">${agencies.reduce((s, a) => s + parseInt(a.commission.replace('$', '').replace(',', '')), 0).toLocaleString()}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['agencies', 'commissions', 'salaries', 'recruit'].map((t) => (
          <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
            {t === 'agencies' ? 'Agencies' : t === 'commissions' ? 'Commissions' : t === 'salaries' ? 'Salary Reports' : 'Recruit Host'}
          </button>
        ))}
      </div>

      {tab === 'agencies' && (
        <div className="card">
          <div className="card-header">All Agencies</div>
          <div className="card-body">
            <div className="search-bar">
              <input placeholder="Search agencies..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Name</th><th>Manager</th><th>Hosts</th><th>Active</th><th>Earnings</th><th>Commission</th><th>Salary Paid</th><th>Rating</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 500 }}>{a.name}</td>
                      <td>{a.manager}</td>
                      <td>{a.hosts}</td>
                      <td>{a.activeHosts}</td>
                      <td>{a.totalEarnings}</td>
                      <td>{a.commission}</td>
                      <td>{a.salaryPaid}</td>
                      <td>⭐ {a.rating}</td>
                      <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'commissions' && (
        <div className="card">
          <div className="card-header">Commission Reports</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Host</th><th>Agency</th><th>Commission %</th><th>Host Earned</th><th>Agency Share</th><th>Paid</th></tr>
                </thead>
                <tbody>
                  {commissionsData.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{c.host}</td>
                      <td>{c.agency}</td>
                      <td>{c.commission}</td>
                      <td>{c.earned}</td>
                      <td>{c.agencyShare}</td>
                      <td><span className={`badge ${c.paid === 'Yes' ? 'active' : 'pending'}`}>{c.paid}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'salaries' && (
        <div className="card">
          <div className="card-header">Salary Reports</div>
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Total Salary Budget</div>
                <div className="detail-value" style={{ fontSize: 24 }}>$27,200</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Paid This Month</div>
                <div className="detail-value" style={{ fontSize: 24, color: 'var(--success)' }}>$14,000</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Pending</div>
                <div className="detail-value" style={{ fontSize: 24, color: 'var(--warning)' }}>$13,200</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Next Payment Date</div>
                <div className="detail-value">June 1, 2026</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'recruit' && (
        <div className="card">
          <div className="card-header">Host Recruitment</div>
          <div className="card-body">
            <form onSubmit={handleRecruit}>
              <div className="detail-grid">
                <div className="form-group"><label>Host Name</label><input value={recruitForm.hostName} onChange={(e) => setRecruitForm({ ...recruitForm, hostName: e.target.value })} required /></div>
                <div className="form-group"><label>Host Email</label><input type="email" value={recruitForm.hostEmail} onChange={(e) => setRecruitForm({ ...recruitForm, hostEmail: e.target.value })} required /></div>
                <div className="form-group"><label>Commission (%)</label><input type="number" value={recruitForm.commission} onChange={(e) => setRecruitForm({ ...recruitForm, commission: e.target.value })} required /></div>
              </div>
              <div style={{ marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
