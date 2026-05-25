import { useState } from 'react'
import Modal from '../components/Modal'

const defaultCountries = [
  { country: 'India', flag: '🇮🇳', users: 58400, activeUsers: 12450, hosts: 42, rooms: 156, revenue: '$12,400', reports: 18, status: 'active' },
  { country: 'Pakistan', flag: '🇵🇰', users: 32100, activeUsers: 7800, hosts: 28, rooms: 98, revenue: '$6,800', reports: 12, status: 'active' },
  { country: 'Bangladesh', flag: '🇧🇩', users: 24900, activeUsers: 5600, hosts: 19, rooms: 72, revenue: '$4,200', reports: 8, status: 'active' },
  { country: 'Nepal', flag: '🇳🇵', users: 8900, activeUsers: 2100, hosts: 8, rooms: 31, revenue: '$1,800', reports: 3, status: 'active' },
  { country: 'Sri Lanka', flag: '🇱🇰', users: 6200, activeUsers: 1400, hosts: 5, rooms: 22, revenue: '$950', reports: 2, status: 'active' },
]

export default function CountryHandler() {
  const [countries] = useState(defaultCountries)
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  const filtered = countries.filter((c) => c.country.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card"><div className="label">Total Countries</div><div className="value">{countries.length}</div></div>
        <div className="stats-card"><div className="label">Total Users</div><div className="value">{countries.reduce((s, c) => s + c.users, 0).toLocaleString()}</div></div>
        <div className="stats-card"><div className="label">Active Users</div><div className="value">{countries.reduce((s, c) => s + c.activeUsers, 0).toLocaleString()}</div></div>
        <div className="stats-card"><div className="label">Total Revenue</div><div className="value">{countries.reduce((s, c) => s + parseInt(c.revenue.replace('$', '').replace(',', '')), 0).toLocaleString()}</div></div>
      </div>

      <div className="card">
        <div className="card-header">Country Dashboard</div>
        <div className="card-body">
          <div className="search-bar">
            <input placeholder="Search country..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Country</th><th>Users</th><th>Active</th><th>Hosts</th><th>Rooms</th><th>Revenue</th><th>Reports</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.country}>
                    <td style={{ fontWeight: 500 }}>{c.flag} {c.country}</td>
                    <td>{c.users.toLocaleString()}</td>
                    <td>{c.activeUsers.toLocaleString()}</td>
                    <td>{c.hosts}</td>
                    <td>{c.rooms}</td>
                    <td style={{ fontWeight: 600 }}>{c.revenue}</td>
                    <td>{c.reports}</td>
                    <td><span className={`badge ${c.status}`}>{c.status}</span></td>
                    <td><button className="btn btn-primary btn-sm" onClick={() => setSelectedCountry(c)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCountry && (
        <Modal title={`${selectedCountry.flag} ${selectedCountry.country}`} onClose={() => setSelectedCountry(null)}>
          <div className="detail-grid">
            <div className="detail-item"><div className="detail-label">Total Users</div><div className="detail-value">{selectedCountry.users.toLocaleString()}</div></div>
            <div className="detail-item"><div className="detail-label">Active Users</div><div className="detail-value">{selectedCountry.activeUsers.toLocaleString()}</div></div>
            <div className="detail-item"><div className="detail-label">Active Hosts</div><div className="detail-value">{selectedCountry.hosts}</div></div>
            <div className="detail-item"><div className="detail-label">Active Rooms</div><div className="detail-value">{selectedCountry.rooms}</div></div>
            <div className="detail-item"><div className="detail-label">Revenue</div><div className="detail-value">{selectedCountry.revenue}</div></div>
            <div className="detail-item"><div className="detail-label">Pending Reports</div><div className="detail-value">{selectedCountry.reports}</div></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary" style={{ marginRight: 8 }}>Local Support</button>
            <button className="btn btn-outline">Room Controls</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
