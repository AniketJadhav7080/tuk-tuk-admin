import { useState } from 'react'
import Modal from '../components/Modal'

export default function HostPanel() {
  const [tab, setTab] = useState('dashboard')
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', method: 'bank' })

  const stats = [
    { label: 'Total Earnings', value: '$6,800' },
    { label: 'This Month', value: '$1,240' },
    { label: 'Gift Revenue', value: '$3,450' },
    { label: 'Followers', value: '18,700' },
    { label: 'PK Wins', value: '45' },
    { label: 'PK Losses', value: '10' },
  ]

  const transactions = [
    { date: '2026-05-19', type: 'Gift Revenue', amount: '+$45', balance: '$6,800' },
    { date: '2026-05-18', type: 'Gift Revenue', amount: '+$120', balance: '$6,755' },
    { date: '2026-05-17', type: 'Withdrawal', amount: '-$200', balance: '$6,635' },
    { date: '2026-05-16', type: 'PK Bonus', amount: '+$50', balance: '$6,835' },
    { date: '2026-05-15', type: 'Gift Revenue', amount: '+$85', balance: '$6,785' },
  ]

  const pkHistory = [
    { date: '2026-05-19', opponent: 'DJ Ravi', result: 'Win', score: '12,450 - 8,230', reward: '$50' },
    { date: '2026-05-18', opponent: 'Comedy King', result: 'Win', score: '9,800 - 6,100', reward: '$50' },
    { date: '2026-05-17', opponent: 'Singer Priya', result: 'Loss', score: '7,200 - 11,500', reward: '-' },
    { date: '2026-05-16', opponent: 'DJ Alex', result: 'Win', score: '15,000 - 4,200', reward: '$75' },
  ]

  const handleWithdraw = (e) => {
    e.preventDefault()
    setWithdrawModal(false)
    setWithdrawForm({ amount: '', method: 'bank' })
  }

  return (
    <div>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stats-card">
            <div className="label">{s.label}</div>
            <div className="value">{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['dashboard', 'pk_history', 'followers'].map((t) => (
          <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
            {t === 'dashboard' ? 'Earnings' : t === 'pk_history' ? 'PK Battles' : 'Followers'}
          </button>
        ))}
        <button className="btn btn-success btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setWithdrawModal(true)}>
          Request Withdrawal
        </button>
      </div>

      {tab === 'dashboard' && (
        <div className="card">
          <div className="card-header">Earnings History</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Date</th><th>Type</th><th>Amount</th><th>Balance</th></tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i}>
                      <td>{t.date}</td>
                      <td>{t.type}</td>
                      <td style={{ fontWeight: 600, color: t.amount.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>{t.amount}</td>
                      <td>{t.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'pk_history' && (
        <div className="card">
          <div className="card-header">PK Battle History</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Date</th><th>Opponent</th><th>Result</th><th>Score</th><th>Reward</th></tr>
                </thead>
                <tbody>
                  {pkHistory.map((p, i) => (
                    <tr key={i}>
                      <td>{p.date}</td>
                      <td style={{ fontWeight: 500 }}>{p.opponent}</td>
                      <td><span className={`badge ${p.result === 'Win' ? 'active' : 'banned'}`}>{p.result}</span></td>
                      <td>{p.score}</td>
                      <td>{p.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'followers' && (
        <div className="card">
          <div className="card-header">Followers & Fans</div>
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Total Followers</div>
                <div className="detail-value" style={{ fontSize: 28 }}>18,700</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">New This Week</div>
                <div className="detail-value" style={{ fontSize: 28, color: 'var(--success)' }}>+340</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Top Fans</div>
                <div className="detail-value">48</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Fan Coins Donated</div>
                <div className="detail-value">12,450</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {withdrawModal && (
        <Modal title="Withdrawal Request" onClose={() => setWithdrawModal(false)}>
          <form onSubmit={handleWithdraw}>
            <div className="form-group">
              <label>Amount ($)</label>
              <input type="number" value={withdrawForm.amount} onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Withdrawal Method</label>
              <select value={withdrawForm.method} onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                <option value="bank">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setWithdrawModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-success">Submit Request</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
