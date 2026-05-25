import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import StatsCard from '../components/StatsCard'
import Loading from '../components/Loading'
import { api } from '../services/api'

const defaultStats = [
  { label: 'Total Users', value: '128,430', change: '12% this month' },
  { label: '🟢 Online Now', value: '4,892', change: '8% this hour' },
  { label: 'Active Rooms', value: '1,847', change: '5% this month' },
  { label: 'Reports Pending', value: '48', change: '3% this month', type: 'down' },
]

const defaultRevenue = [
  { label: 'Revenue (MTD)', value: '$24,580', change: '18% this month' },
  { label: 'Coins Purchased', value: '1,250,000', change: '22% this month' },
  { label: 'VIP Subscriptions', value: '3,420', change: '15% this month' },
  { label: 'Avg. Revenue/User', value: '$0.19', change: '6% this month' },
]

const defaultChartData = [
  { name: 'Mon', users: 4200, rooms: 180 },
  { name: 'Tue', users: 3800, rooms: 165 },
  { name: 'Wed', users: 5100, rooms: 200 },
  { name: 'Thu', users: 4800, rooms: 195 },
  { name: 'Fri', users: 5600, rooms: 220 },
  { name: 'Sat', users: 6200, rooms: 250 },
  { name: 'Sun', users: 5900, rooms: 240 },
]

const deviceData = [
  { name: 'Android', value: 68 },
  { name: 'iOS', value: 28 },
  { name: 'Web', value: 4 },
]
const COLORS = ['#0a7ea4', '#27ae60', '#f39c12']

export default function Dashboard() {
  const [stats, setStats] = useState(defaultStats)
  const [revenue, setRevenue] = useState(defaultRevenue)
  const [chartData, setChartData] = useState(defaultChartData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboard()
      .then((data) => {
        if (data?.stats) setStats(data.stats)
        if (data?.revenue) setRevenue(data.revenue)
        if (data?.chartData) setChartData(data.chartData)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <StatsCard key={i} label={s.label} value={s.value} change={s.change} changeType={s.type} />
        ))}
      </div>

      <div className="stats-grid">
        {revenue.map((s, i) => (
          <StatsCard key={i} label={s.label} value={s.value} change={s.change} changeType={s.type} />
        ))}
      </div>

      <div className="chart-grid">
        <div className="card">
          <div className="card-header">New Users (Last 7 Days)</div>
          <div className="card-body chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#0a7ea4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Device Distribution</div>
          <div className="card-body" style={{ padding: 12 }}>
            <div className="pie-wrapper">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" outerRadius="80%" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {deviceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-header">Active Rooms (Last 7 Days)</div>
          <div className="card-body chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rooms" stroke="#27ae60" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
