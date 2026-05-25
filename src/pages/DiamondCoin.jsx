import { useState } from 'react'
import Modal from '../components/Modal'

const defaultTransactions = [
  { id: 't1', user: 'Rahul Sharma', type: 'purchase', coins: 500, amount: '$4.99', method: 'GPay', status: 'completed', date: '2026-05-19 14:30' },
  { id: 't2', user: 'Priya Singh', type: 'gift_sent', coins: 100, amount: '-', method: '-', status: 'completed', date: '2026-05-19 13:15' },
  { id: 't3', user: 'Ahmed Khan', type: 'purchase', coins: 1200, amount: '$9.99', method: 'UPI', status: 'pending', date: '2026-05-19 12:00' },
  { id: 't4', user: 'Sara Ali', type: 'withdrawal', coins: -500, amount: '$4.50', method: 'Bank', status: 'pending', date: '2026-05-18 16:45' },
  { id: 't5', user: 'Neha Patel', type: 'gift_received', coins: 250, amount: '-', method: '-', status: 'completed', date: '2026-05-18 15:20' },
  { id: 't6', user: 'Amit Kumar', type: 'purchase', coins: 3000, amount: '$24.99', method: 'PayPal', status: 'completed', date: '2026-05-18 10:00' },
]

export default function DiamondCoin() {
  const [transactions, setTransactions] = useState(defaultTransactions)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ user: '', coins: '', type: 'purchase' })

  const totalCoins = transactions.reduce((s, t) => s + (t.type === 'purchase' ? t.coins : 0), 0)
  const pendingTotal = transactions.filter((t) => t.status === 'pending').length

  const handleAddCoins = (e) => {
    e.preventDefault()
    const newT = {
      id: `t${Date.now()}`,
      user: addForm.user,
      type: addForm.type,
      coins: parseInt(addForm.coins),
      amount: '-',
      method: 'Admin',
      status: 'completed',
      date: new Date().toLocaleString(),
    }
    setTransactions((prev) => [newT, ...prev])
    setShowAdd(false)
    setAddForm({ user: '', coins: '', type: 'purchase' })
  }

  const filtered = transactions.filter((t) =>
    t.user.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card"><div className="label">Total Coins in Circulation</div><div className="value">{totalCoins.toLocaleString()}</div></div>
        <div className="stats-card"><div className="label">Pending Transactions</div><div className="value" style={{ color: 'var(--warning)' }}>{pendingTotal}</div></div>
        <div className="stats-card"><div className="label">Today's Purchases</div><div className="value">$124.50</div></div>
        <div className="stats-card"><div className="label">This Month</div><div className="value">$3,840</div></div>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Coin Transaction History</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Coins</button>
        </div>
        <div className="card-body">
          <div className="search-bar">
            <input placeholder="Search by user..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Coins</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.user}</td>
                    <td><span className="badge reported" style={{ textTransform: 'capitalize' }}>{t.type.replace('_', ' ')}</span></td>
                    <td style={{ fontWeight: 600, color: t.coins > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {t.coins > 0 ? '+' : ''}{t.coins.toLocaleString()}
                    </td>
                    <td>{t.amount}</td>
                    <td>{t.method}</td>
                    <td><span className={`badge ${t.status}`}>{t.status}</span></td>
                    <td>{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAdd && (
        <Modal title="Add / Deduct Coins" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAddCoins}>
            <div className="form-group">
              <label>User Email or ID</label>
              <input value={addForm.user} onChange={(e) => setAddForm({ ...addForm, user: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={addForm.type} onChange={(e) => setAddForm({ ...addForm, type: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                <option value="purchase">Add Coins (Purchase)</option>
                <option value="bonus">Add Coins (Bonus)</option>
                <option value="deduction">Deduct Coins</option>
              </select>
            </div>
            <div className="form-group">
              <label>Coins</label>
              <input type="number" value={addForm.coins} onChange={(e) => setAddForm({ ...addForm, coins: e.target.value })} required />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
