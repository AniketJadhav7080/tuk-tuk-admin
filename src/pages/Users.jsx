import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasPermission, PERMISSIONS } from '../permissions'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import { api } from '../services/api'

const defaultUsers = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@email.com', status: 'active', vip: true, rooms: 3, reports: 0, joined: '2026-01-15', device: 'iPhone 15', ip: '192.168.1.45', country: 'India' },
  { id: '2', name: 'Priya Singh', email: 'priya@email.com', status: 'active', vip: false, rooms: 5, reports: 1, joined: '2026-02-20', device: 'Samsung S24', ip: '10.0.0.32', country: 'India' },
  { id: '3', name: 'Ahmed Khan', email: 'ahmed@email.com', status: 'banned', vip: false, rooms: 1, reports: 4, joined: '2026-01-10', device: 'Xiaomi 14', ip: '172.16.0.12', country: 'Pakistan' },
  { id: '4', name: 'Sara Ali', email: 'sara@email.com', status: 'active', vip: true, rooms: 2, reports: 0, joined: '2026-03-05', device: 'iPhone 14', ip: '192.168.1.100', country: 'Bangladesh' },
  { id: '5', name: 'John Doe', email: 'john@email.com', status: 'inactive', vip: false, rooms: 0, reports: 0, joined: '2026-01-01', device: 'Pixel 8', ip: '203.0.113.5', country: 'USA' },
]

export default function Users() {
  const { user } = useAuth()
  const [users, setUsers] = useState(defaultUsers)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [banModal, setBanModal] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    api.getUsers()
      .then((data) => { if (data?.users) setUsers(data.users) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const canBan = hasPermission(user, PERMISSIONS.BAN_USERS)
  const canEdit = hasPermission(user, PERMISSIONS.EDIT_USERS)
  const canVerifyVip = hasPermission(user, PERMISSIONS.VERIFY_VIP)

  const handleBan = async (u) => {
    try {
      await api.updateUser(u.id, { status: u.status === 'banned' ? 'active' : 'banned' })
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: x.status === 'banned' ? 'active' : 'banned' } : x))
      setBanModal(null)
    } catch { setBanModal(null) }
  }

  const handleEdit = async () => {
    try {
      await api.updateUser(editModal.id, editForm)
      setUsers((prev) => prev.map((x) => x.id === editModal.id ? { ...x, ...editForm } : x))
      setEditModal(null)
    } catch { setEditModal(null) }
  }

  const toggleVip = async (u) => {
    try {
      await api.updateUser(u.id, { vip: !u.vip })
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, vip: !x.vip } : x))
    } catch {}
  }

  const openEdit = (u) => {
    setEditForm({ name: u.name, email: u.email, phone: u.phone || '', country: u.country || '' })
    setEditModal(u)
  }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loading />

  return (
    <div>
      <div className="card">
        <div className="card-header">All Users ({users.length})</div>
        <div className="card-body">
          <div className="search-bar">
            <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>VIP</th>
                  <th>Device</th>
                  <th>IP Address</th>
                  <th>Country</th>
                  <th>Rooms</th>
                  <th>Reports</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td><Link to={`/users/${u.id}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>{u.name}</Link></td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.status}`}>{u.status}</span></td>
                    <td>{u.vip ? <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>⭐ VIP</span> : '-'}</td>
                    <td style={{ fontSize: 13 }}>{u.device || '-'}</td>
                    <td style={{ fontSize: 13, fontFamily: 'monospace' }}>{u.ip || '-'}</td>
                    <td>{u.country || '-'}</td>
                    <td>{u.rooms}</td>
                    <td>{u.reports}</td>
                    <td>
                      <div className="actions">
                        <Link to={`/users/${u.id}`} className="btn btn-primary btn-sm">View</Link>
                        {canEdit && <button className="btn btn-outline btn-sm" onClick={() => openEdit(u)}>Edit</button>}
                        {canVerifyVip && (
                          <button className={`btn btn-sm ${u.vip ? 'btn-warning' : 'btn-success'}`} onClick={() => toggleVip(u)}>
                            {u.vip ? 'Un-VIP' : 'VIP'}
                          </button>
                        )}
                        {canBan && (
                          <button className={`btn btn-sm ${u.status === 'banned' ? 'btn-success' : 'btn-warning'}`} onClick={() => setBanModal(u)}>
                            {u.status === 'banned' ? 'Unban' : 'Ban'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {banModal && (
        <Modal title={banModal.status === 'banned' ? 'Unban User' : 'Ban User'} onClose={() => setBanModal(null)}>
          <p>Are you sure you want to {banModal.status === 'banned' ? 'unban' : 'ban'} <strong>{banModal.name}</strong>?</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setBanModal(null)}>Cancel</button>
            <button className={`btn ${banModal.status === 'banned' ? 'btn-success' : 'btn-danger'}`} onClick={() => handleBan(banModal)}>
              {banModal.status === 'banned' ? 'Unban' : 'Ban'}
            </button>
          </div>
        </Modal>
      )}

      {editModal && (
        <Modal title={`Edit User: ${editModal.name}`} onClose={() => setEditModal(null)}>
          <div className="form-group">
            <label>Name</label>
            <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setEditModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEdit}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
