import { useState } from 'react'
import Modal from '../components/Modal'

const defaultGifts = [
  { id: 'g1', name: 'Rose 🌹', icon: '🌹', price: 5, coins: 5, category: 'Flowers', status: 'active', totalSent: 45230 },
  { id: 'g2', name: 'Crown 👑', icon: '👑', price: 50, coins: 50, category: 'Royal', status: 'active', totalSent: 12840 },
  { id: 'g3', name: 'Sports Car 🏎️', icon: '🏎️', price: 200, coins: 200, category: 'Luxury', status: 'active', totalSent: 3450 },
  { id: 'g4', name: 'Rocket 🚀', icon: '🚀', price: 500, coins: 500, category: 'Premium', status: 'active', totalSent: 1230 },
  { id: 'g5', name: 'Heart ❤️', icon: '❤️', price: 1, coins: 1, category: 'Basic', status: 'inactive', totalSent: 89200 },
  { id: 'g6', name: 'Diamond Ring 💍', icon: '💍', price: 1000, coins: 1000, category: 'Premium', status: 'active', totalSent: 890 },
  { id: 'g7', name: 'Teddy Bear 🧸', icon: '🧸', price: 10, coins: 10, category: 'Cute', status: 'active', totalSent: 23100 },
  { id: 'g8', name: 'Lamborghini 🏎️', icon: '🏎️', price: 5000, coins: 5000, category: 'Luxury', status: 'active', totalSent: 210 },
]

export default function Gifts() {
  const [gifts, setGifts] = useState(defaultGifts)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '', price: '', coins: '', category: 'Basic' })

  const openAdd = () => {
    setForm({ name: '', icon: '', price: '', coins: '', category: 'Basic' })
    setShowAdd(true)
  }

  const openEdit = (g) => {
    setForm({ name: g.name, icon: g.icon, price: String(g.price), coins: String(g.coins), category: g.category })
    setEditModal(g)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = { ...form, price: parseInt(form.price), coins: parseInt(form.coins) }
    if (editModal) {
      setGifts((prev) => prev.map((g) => g.id === editModal.id ? { ...g, ...data } : g))
      setEditModal(null)
    } else {
      setGifts((prev) => [{ id: `g${Date.now()}`, ...data, status: 'active', totalSent: 0 }, ...prev])
      setShowAdd(false)
    }
  }

  const toggleStatus = (id) => {
    setGifts((prev) => prev.map((g) => g.id === id ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g))
  }

  const filtered = gifts.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card"><div className="label">Total Gifts</div><div className="value">{gifts.length}</div></div>
        <div className="stats-card"><div className="label">Active Gifts</div><div className="value">{gifts.filter((g) => g.status === 'active').length}</div></div>
        <div className="stats-card"><div className="label">Most Sent</div><div className="value" style={{ fontSize: 18 }}>{gifts.reduce((a, b) => a.totalSent > b.totalSent ? a : b).name}</div></div>
        <div className="stats-card"><div className="label">Total Sent</div><div className="value">{gifts.reduce((s, g) => s + g.totalSent, 0).toLocaleString()}</div></div>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Gift Catalog</span>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Gift</button>
        </div>
        <div className="card-body">
          <div className="search-bar">
            <input placeholder="Search gifts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Coins</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Total Sent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id}>
                    <td style={{ fontSize: 24 }}>{g.icon}</td>
                    <td style={{ fontWeight: 500 }}>{g.name}</td>
                    <td>${g.price}</td>
                    <td>{g.coins.toLocaleString()}</td>
                    <td><span className="badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>{g.category}</span></td>
                    <td><span className={`badge ${g.status}`}>{g.status}</span></td>
                    <td>{g.totalSent.toLocaleString()}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(g)}>Edit</button>
                        <button className={`btn btn-sm ${g.status === 'active' ? 'btn-warning' : 'btn-success'}`} onClick={() => toggleStatus(g.id)}>
                          {g.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(showAdd || editModal) && (
        <Modal title={editModal ? 'Edit Gift' : 'Add New Gift'} onClose={() => { setShowAdd(false); setEditModal(null) }}>
          <form onSubmit={handleSave}>
            <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Icon (emoji)</label><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label>Price ($)</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
              <div className="form-group"><label>Coins</label><input type="number" value={form.coins} onChange={(e) => setForm({ ...form, coins: e.target.value })} required /></div>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                {['Basic', 'Flowers', 'Cute', 'Royal', 'Luxury', 'Premium'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => { setShowAdd(false); setEditModal(null) }}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editModal ? 'Save Changes' : 'Add Gift'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
