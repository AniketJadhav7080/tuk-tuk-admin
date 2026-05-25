const API_BASE = '/api';
async function request(endpoint, options = {}) {
  const token = sessionStorage.getItem('admin_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) { sessionStorage.removeItem('admin_token'); window.location.href = '/login'; }
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}
export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getDashboard: () => request('/dashboard'),
  getUsers: (params = '') => request(`/users${params}`),
  getUser: (id) => request(`/users/${id}`),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getRooms: (params = '') => request(`/rooms${params}`),
  getRoom: (id) => request(`/rooms/${id}`),
  closeRoom: (id) => request(`/rooms/${id}/close`, { method: 'POST' }),
  getReports: (params = '') => request(`/reports${params}`),
  resolveReport: (id) => request(`/reports/${id}/resolve`, { method: 'POST' }),
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};