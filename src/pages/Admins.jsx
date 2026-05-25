import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../permissions'
import Modal from '../components/Modal'

const roleColors = {
  super_admin: '#8b5cf6',
  moderator: '#0a7ea4',
  support: '#27ae60',
}

const roleLabels = {
  super_admin: 'Super Admin',
  moderator: 'Moderator',
  support: 'Support Staff',
}

export default function Admins() {
  const { allAdmins, addAdmin, removeAdmin } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: ROLES.MODERATOR })
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    addAdmin(form)
    setForm({ name: '', email: '', role: ROLES.MODERATOR })
    setShowModal(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  const handleDelete = () => {
    if (deleteModal) {
      removeAdmin(deleteModal.id)
      setDeleteModal(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ color: 'var(--text-light)', fontSize: 14 }}>{allAdmins.length} admin accounts</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Admin</button>
      </div>

      {added && (
        <div style={{ padding: 10, borderRadius: 'var(--radius)', background: '#d1fae5', color: '#065f46', fontSize: 13, marginBottom: 16 }}>
          ✓ Admin added successfully
        </div>
      )}

      <div className="card">
        <div className="card-header">All Administrators</div>
        <div className="card-body">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allAdmins.map((a) => (
                  <tr key={a.id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 32, height: 32, borderRadius: '50%', background: roleColors[a.role], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13 }}>
                        {a.name.charAt(0)}
                      </span>
                      {a.name}
                    </td>
                    <td>{a.email}</td>
                    <td><span className="role-badge" style={{ background: roleColors[a.role], fontSize: 12 }}>{roleLabels[a.role]}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--text-light)' }}>
                      {a.role === 'super_admin' ? 'All permissions' : a.role === 'moderator' ? 'Users, Rooms, Reports, Notifications' : 'View users, reports, notifications'}
                    </td>
                    <td>
                      {a.role !== 'super_admin' && (
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal(a)}>Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title="Add New Admin" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                <option value={ROLES.MODERATOR}>Moderator</option>
                <option value={ROLES.SUPPORT}>Support Staff</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Admin</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteModal && (
        <Modal title="Remove Admin" onClose={() => setDeleteModal(null)}>
          <p>Are you sure you want to remove <strong>{deleteModal.name}</strong>?</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setDeleteModal(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Remove</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
