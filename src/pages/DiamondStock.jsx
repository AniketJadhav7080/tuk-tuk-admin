import { useState } from 'react'
import Modal from '../components/Modal'

const defaultAgents = [
  { id: 'ag1', name: 'Rajesh Enterprises', balance: 25000, distributed: 18000, pending: 7000, status: 'active', lastRecharge: '2026-05-19' },
  { id: 'ag2', name: 'Priya Distributors', balance: 15000, distributed: 12000, pending: 3000, status: 'active', lastRecharge: '2026-05-18' },
  { id: 'ag3', name: 'Ahmed Trading Co', balance: 8000, distributed: 5000, pending: 3000, status: 'active', lastRecharge: '2026-05-17' },
  { id: 'ag4', name: 'New Agent', balance: 0, distributed: 0, pending: 0, status: 'inactive', lastRecharge: '-' },
]

const pendingRecharges = [
  { id: 'r1', agent: 'Rajesh Enterprises', amount: 10000, method: 'Bank Transfer', date: '2026-05-19 10:30', status: 'pending' },
  { id: 'r2', agent: 'Priya Distributors', amount: 5000, method: 'UPI', date: '2026-05-19 09:15', status: 'pending' },
  { id: 'r3', agent: 'Ahmed Trading Co', amount: 3000, method: 'PayPal', date: '2026-05-18 16:00', status: 'pending' },
]

export default function DiamondStock() {
  const [agents, setAgents] = useState(defaultAgents)
  const [recharges, setRecharges] = useState(pendingRecharges)
  const [tab, setTab] = useState('stock')
  const [approveModal, setApproveModal] = useState(null)
  const [addAgentModal, setAddAgentModal] = useState(false)
  const [distributeModal, setDistributeModal] = useState(null)
  const [agentForm, setAgentForm] = useState({ name: '', balance: '' })
  const [distributeForm, setDistributeForm] = useState({ amount: '' })

  const totalStock = agents.reduce((s, a) => s + a.balance, 0)
  const totalDistributed = agents.reduce((s, a) => s + a.distributed, 0)

  const handleApprove = () => {
    setRecharges((prev) => prev.map((r) => r.id === approveModal.id ? { ...r, status: 'approved' } : r))
    setAgents((prev) => prev.map((a) => a.id === approveModal.agentId ? { ...a, balance: a.balance + approveModal.amount, pending: a.pending - approveModal.amount } : a))
    setApproveModal(null)
  }

  const handleAddAgent = (e) => {
    e.preventDefault()
    setAgents((prev) => [...prev, { id: `ag${Date.now()}`, name: agentForm.name, balance: parseInt(agentForm.balance) || 0, distributed: 0, pending: 0, status: 'active', lastRecharge: new Date().toLocaleDateString() }])
    setAddAgentModal(false)
    setAgentForm({ name: '', balance: '' })
  }

  const handleDistribute = (e) => {
    e.preventDefault()
    const amount = parseInt(distributeForm.amount)
    setAgents((prev) => prev.map((a) => a.id === distributeModal.id ? { ...a, balance: a.balance - amount, distributed: a.distributed + amount } : a))
    setDistributeModal(null)
    setDistributeForm({ amount: '' })
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card"><div className="label">Total Stock</div><div className="value">{totalStock.toLocaleString()}</div></div>
        <div className="stats-card"><div className="label">Total Distributed</div><div className="value">{totalDistributed.toLocaleString()}</div></div>
        <div className="stats-card"><div className="label">Pending Recharges</div><div className="value" style={{ color: 'var(--warning)' }}>{recharges.filter((r) => r.status === 'pending').length}</div></div>
        <div className="stats-card"><div className="label">Active Agents</div><div className="value">{agents.filter((a) => a.status === 'active').length}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['stock', 'recharge', 'agents'].map((t) => (
          <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
            {t === 'stock' ? 'Stock Management' : t === 'recharge' ? 'Recharge Approval' : 'Agent Distribution'}
          </button>
        ))}
      </div>

      {tab === 'stock' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Agent Stock Balances</span>
            <button className="btn btn-primary btn-sm" onClick={() => setAddAgentModal(true)}>+ Add Agent</button>
          </div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Agent Name</th><th>Balance</th><th>Distributed</th><th>Pending</th><th>Status</th><th>Last Recharge</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {agents.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 500 }}>{a.name}</td>
                      <td style={{ fontWeight: 600 }}>{a.balance.toLocaleString()}</td>
                      <td>{a.distributed.toLocaleString()}</td>
                      <td style={{ color: a.pending > 0 ? 'var(--warning)' : 'var(--text-light)' }}>{a.pending.toLocaleString()}</td>
                      <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                      <td>{a.lastRecharge}</td>
                      <td>
                        {a.balance > 0 && (
                          <button className="btn btn-success btn-sm" onClick={() => setDistributeModal(a)}>Distribute</button>
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

      {tab === 'recharge' && (
        <div className="card">
          <div className="card-header">Pending Recharge Approvals</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Agent</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {recharges.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500 }}>{r.agent}</td>
                      <td style={{ fontWeight: 600 }}>${r.amount.toLocaleString()}</td>
                      <td>{r.method}</td>
                      <td>{r.date}</td>
                      <td><span className={`badge ${r.status}`}>{r.status}</span></td>
                      <td>
                        {r.status === 'pending' && (
                          <button className="btn btn-success btn-sm" onClick={() => setApproveModal({ ...r, agentId: agents.find((a) => a.name === r.agent)?.id })}>Approve</button>
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

      {tab === 'agents' && (
        <div className="card">
          <div className="card-header">Agent Distribution History</div>
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item"><div className="detail-label">Total Agents</div><div className="detail-value" style={{ fontSize: 24 }}>{agents.length}</div></div>
              <div className="detail-item"><div className="detail-label">Active Agents</div><div className="detail-value" style={{ fontSize: 24, color: 'var(--success)' }}>{agents.filter((a) => a.status === 'active').length}</div></div>
              <div className="detail-item"><div className="detail-label">Total Distributed</div><div className="detail-value" style={{ fontSize: 24 }}>{totalDistributed.toLocaleString()}</div></div>
              <div className="detail-item"><div className="detail-label">Avg Per Agent</div><div className="detail-value" style={{ fontSize: 24 }}>{(totalDistributed / agents.length).toFixed(0).toLocaleString()}</div></div>
            </div>
          </div>
        </div>
      )}

      {approveModal && (
        <Modal title="Approve Recharge" onClose={() => setApproveModal(null)}>
          <p>Approve ${approveModal.amount.toLocaleString()} recharge for <strong>{approveModal.agent}</strong>?</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setApproveModal(null)}>Cancel</button>
            <button className="btn btn-success" onClick={handleApprove}>Approve</button>
          </div>
        </Modal>
      )}

      {addAgentModal && (
        <Modal title="Add New Agent" onClose={() => setAddAgentModal(false)}>
          <form onSubmit={handleAddAgent}>
            <div className="form-group"><label>Agent Name</label><input value={agentForm.name} onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })} required /></div>
            <div className="form-group"><label>Initial Balance</label><input type="number" value={agentForm.balance} onChange={(e) => setAgentForm({ ...agentForm, balance: e.target.value })} /></div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setAddAgentModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Agent</button>
            </div>
          </form>
        </Modal>
      )}

      {distributeModal && (
        <Modal title={`Distribute to ${distributeModal.name}`} onClose={() => setDistributeModal(null)}>
          <form onSubmit={handleDistribute}>
            <p style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-light)' }}>Available balance: <strong>{distributeModal.balance.toLocaleString()}</strong></p>
            <div className="form-group"><label>Amount</label><input type="number" value={distributeForm.amount} onChange={(e) => setDistributeForm({ amount: e.target.value })} max={distributeModal.balance} required /></div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setDistributeModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-success">Distribute</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
