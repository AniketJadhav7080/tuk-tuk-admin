import { useState } from 'react'
import Modal from '../components/Modal'

const defaultMethods = [
  { id: 'pm1', name: 'GPay (Google Pay)', type: 'upi', status: 'active', fee: '0%', minAmount: '$1', maxAmount: '$500', transactions: 12450 },
  { id: 'pm2', name: 'PhonePe', type: 'upi', status: 'active', fee: '0%', minAmount: '$1', maxAmount: '$500', transactions: 8920 },
  { id: 'pm3', name: 'PayPal', type: 'wallet', status: 'active', fee: '2.9%', minAmount: '$5', maxAmount: '$2000', transactions: 3450 },
  { id: 'pm4', name: 'Razorpay', type: 'gateway', status: 'active', fee: '2%', minAmount: '$1', maxAmount: '$10000', transactions: 23100 },
  { id: 'pm5', name: 'Bank Transfer', type: 'bank', status: 'inactive', fee: '1%', minAmount: '$50', maxAmount: '$5000', transactions: 890 },
]

const transactionHistory = [
  { id: 'tx1', user: 'Rahul Sharma', amount: '$4.99', method: 'GPay', type: 'coin_purchase', coins: 500, status: 'success', date: '2026-05-19 14:30' },
  { id: 'tx2', user: 'Priya Singh', amount: '$9.99', method: 'PayPal', type: 'coin_purchase', coins: 1200, status: 'success', date: '2026-05-19 13:15' },
  { id: 'tx3', user: 'Ahmed Khan', amount: '$24.99', method: 'Razorpay', type: 'vip_subscription', coins: 0, status: 'success', date: '2026-05-19 12:00' },
  { id: 'tx4', user: 'Sara Ali', amount: '$4.50', method: 'Bank Transfer', type: 'withdrawal', coins: -500, status: 'pending', date: '2026-05-18 16:45' },
  { id: 'tx5', user: 'Neha Patel', amount: '$50.00', method: 'PhonePe', type: 'withdrawal', coins: -5000, status: 'failed', date: '2026-05-18 10:00' },
]

export default function Payments() {
  const [tab, setTab] = useState('gateways')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'upi', fee: '', minAmount: '', maxAmount: '' })

  const totalRevenue = transactionHistory
    .filter((t) => t.status === 'success' && t.type !== 'withdrawal')
    .reduce((s, t) => s + parseFloat(t.amount.replace('$', '')), 0)

  const handleAdd = (e) => {
    e.preventDefault()
    setShowAdd(false)
    setForm({ name: '', type: 'upi', fee: '', minAmount: '', maxAmount: '' })
  }

  const toggleStatus = (id) => {
    // would call API in real app
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card"><div className="label">Active Gateways</div><div className="value">{defaultMethods.filter((m) => m.status === 'active').length}</div></div>
        <div className="stats-card"><div className="label">Today's Revenue</div><div className="value" style={{ color: 'var(--success)' }}>${totalRevenue.toFixed(2)}</div></div>
        <div className="stats-card"><div className="label">Monthly Revenue</div><div className="value">$12,450</div></div>
        <div className="stats-card"><div className="label">Pending Withdrawals</div><div className="value" style={{ color: 'var(--warning)' }}>{transactionHistory.filter((t) => t.status === 'pending').length}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['gateways', 'transactions', 'withdrawals'].map((t) => (
          <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
            {t === 'gateways' ? 'Payment Gateways' : t === 'transactions' ? 'Transactions' : 'Withdrawals'}
          </button>
        ))}
      </div>

      {tab === 'gateways' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Payment Methods</span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Gateway</button>
          </div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Gateway Name</th><th>Type</th><th>Fee</th><th>Min Amount</th><th>Max Amount</th><th>Transactions</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {defaultMethods.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 500 }}>{m.name}</td>
                      <td><span className="badge" style={{ background: '#e0e7ff', color: '#3730a3', textTransform: 'uppercase' }}>{m.type}</span></td>
                      <td>{m.fee}</td>
                      <td>{m.minAmount}</td>
                      <td>{m.maxAmount}</td>
                      <td>{m.transactions.toLocaleString()}</td>
                      <td><span className={`badge ${m.status}`}>{m.status}</span></td>
                      <td>
                        <button className={`btn btn-sm ${m.status === 'active' ? 'btn-warning' : 'btn-success'}`} onClick={() => toggleStatus(m.id)}>
                          {m.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'transactions' && (
        <div className="card">
          <div className="card-header">Transaction History</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>User</th><th>Amount</th><th>Method</th><th>Type</th><th>Coins</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {transactionHistory.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 500 }}>{t.user}</td>
                      <td style={{ fontWeight: 600 }}>{t.amount}</td>
                      <td>{t.method}</td>
                      <td><span className="badge reported" style={{ textTransform: 'capitalize' }}>{t.type.replace('_', ' ')}</span></td>
                      <td style={{ color: t.coins > 0 ? 'var(--success)' : 'var(--danger)' }}>{t.coins > 0 ? '+' : ''}{t.coins.toLocaleString()}</td>
                      <td><span className={`badge ${t.status === 'success' ? 'active' : t.status === 'pending' ? 'pending' : 'banned'}`}>{t.status}</span></td>
                      <td>{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'withdrawals' && (
        <div className="card">
          <div className="card-header">Withdrawal Requests</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>User</th><th>Amount</th><th>Method</th><th>Account</th><th>Requested</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {transactionHistory.filter((t) => t.type === 'withdrawal').map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 500 }}>{t.user}</td>
                      <td style={{ fontWeight: 600 }}>{t.amount}</td>
                      <td>{t.method}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 13 }}>XXXX1234</td>
                      <td>{t.date}</td>
                      <td><span className={`badge ${t.status}`}>{t.status}</span></td>
                      <td>
                        {t.status === 'pending' && (
                          <div className="actions">
                            <button className="btn btn-success btn-sm">Approve</button>
                            <button className="btn btn-danger btn-sm">Reject</button>
                          </div>
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

      {showAdd && (
        <Modal title="Add Payment Gateway" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <div className="form-group"><label>Gateway Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                <option value="upi">UPI</option>
                <option value="wallet">Wallet</option>
                <option value="gateway">Gateway</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label>Fee (%)</label><input value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} required /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label>Min Amount ($)</label><input value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} required /></div>
              <div className="form-group"><label>Max Amount ($)</label><input value={form.maxAmount} onChange={(e) => setForm({ ...form, maxAmount: e.target.value })} required /></div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Gateway</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
