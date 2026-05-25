import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { hasPermission, PERMISSIONS } from '../permissions'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import { api } from '../services/api'

const defaultRooms = [
  { id: '1', name: 'Music Lovers 🎵', host: 'Rahul Sharma', hostId: '1', participants: 24, category: 'Music', status: 'active', created: '2026-05-19', members: [
    { id: 'u1', name: 'Rahul Sharma', role: 'host' },
    { id: 'u2', name: 'Priya Singh', role: 'member' },
    { id: 'u3', name: 'Amit Patel', role: 'member' },
  ]},
  { id: '2', name: 'Tech Talk', host: 'Priya Singh', hostId: '2', participants: 18, category: 'Tech', status: 'active', created: '2026-05-19', members: [
    { id: 'u4', name: 'Priya Singh', role: 'host' },
    { id: 'u5', name: 'Sara Ali', role: 'member' },
  ]},
  { id: '3', name: 'Gaming Zone 🎮', host: 'Ahmed Khan', hostId: '3', participants: 32, category: 'Gaming', status: 'active', created: '2026-05-18', members: [] },
  { id: '4', name: 'Chill Vibes', host: 'Sara Ali', hostId: '4', participants: 12, category: 'Social', status: 'active', created: '2026-05-19', members: [] },
  { id: '5', name: 'Study Group', host: 'Neha Patel', hostId: '5', participants: 8, category: 'Education', status: 'closed', created: '2026-05-17', members: [] },
]

export default function Rooms() {
  const { user } = useAuth()
  const [rooms, setRooms] = useState(defaultRooms)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [closeModal, setCloseModal] = useState(null)
  const [actionModal, setActionModal] = useState(null)
  const [actionType, setActionType] = useState('')

  const canClose = hasPermission(user, PERMISSIONS.CLOSE_ROOMS)
  const canMuteKick = hasPermission(user, PERMISSIONS.MUTE_KICK)

  useEffect(() => {
    api.getRooms()
      .then((data) => { if (data?.rooms) setRooms(data.rooms) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleClose = async (room) => {
    try {
      await api.closeRoom(room.id)
      setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, status: 'closed' } : r))
      setCloseModal(null)
    } catch { setCloseModal(null) }
  }

  const handleAction = (type, room) => {
    setActionType(type)
    setActionModal(room)
  }

  const performAction = async () => {
    // In real app, this would call API to mute/kick
    setActionModal(null)
  }

  const filtered = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.host.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loading />

  return (
    <div>
      <div className="stats-grid">
        <div className="stats-card">
          <div className="label">Active Rooms</div>
          <div className="value">{rooms.filter((r) => r.status === 'active').length}</div>
        </div>
        <div className="stats-card">
          <div className="label">Total Participants</div>
          <div className="value">{rooms.reduce((s, r) => s + r.participants, 0)}</div>
        </div>
        <div className="stats-card">
          <div className="label">Categories</div>
          <div className="value">{new Set(rooms.map((r) => r.category)).size}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Voice Chat Rooms ({rooms.length})</div>
        <div className="card-body">
          <div className="search-bar">
            <input placeholder="Search rooms or host..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Room Name</th>
                  <th>Host</th>
                  <th>Participants</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td>{r.host}</td>
                    <td>
                      {r.participants}
                      {r.status === 'active' && (
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#27ae60', marginLeft: 6 }} title="Live" />
                      )}
                    </td>
                    <td>{r.category}</td>
                    <td><span className={`badge ${r.status}`}>{r.status}</span></td>
                    <td>{r.created}</td>
                    <td>
                      <div className="actions">
                        {r.members && r.members.length > 0 && (
                          <button className="btn btn-outline btn-sm" onClick={() => handleAction('members', r)} title="View members">
                            👥 {r.members.length}
                          </button>
                        )}
                        {r.status === 'active' && canMuteKick && (
                          <button className="btn btn-warning btn-sm" onClick={() => handleAction('mute', r)} title="Mute all">🔇 Mute</button>
                        )}
                        {r.status === 'active' && canClose && (
                          <button className="btn btn-danger btn-sm" onClick={() => setCloseModal(r)}>Close</button>
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

      {closeModal && (
        <Modal title="Close Room" onClose={() => setCloseModal(null)}>
          <p>Are you sure you want to close <strong>{closeModal.name}</strong>? ({closeModal.participants} participants will be removed.)</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setCloseModal(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleClose(closeModal)}>Close Room</button>
          </div>
        </Modal>
      )}

      {actionModal && actionType === 'members' && (
        <Modal title={`Members: ${actionModal.name}`} onClose={() => setActionModal(null)}>
          {actionModal.members && actionModal.members.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {actionModal.members.map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td><span className={`badge ${m.role === 'host' ? 'active' : 'inactive'}`}>{m.role}</span></td>
                      <td>
                        {m.role !== 'host' && canMuteKick && (
                          <div className="actions">
                            <button className="btn btn-warning btn-sm" onClick={() => { setActionModal(null); alert(`🔇 Muted ${m.name}`) }}>Mute</button>
                            <button className="btn btn-danger btn-sm" onClick={() => { setActionModal(null); alert(`👢 Kicked ${m.name}`) }}>Kick</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-light)' }}>No member data available.</p>
          )}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setActionModal(null)}>Close</button>
          </div>
        </Modal>
      )}

      {actionModal && actionType === 'mute' && (
        <Modal title="Mute Room" onClose={() => setActionModal(null)}>
          <p>Mute all participants in <strong>{actionModal.name}</strong>?</p>
          <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 8 }}>This will mute all non-host members in this room.</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
            <button className="btn btn-warning" onClick={performAction}>Mute All</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
