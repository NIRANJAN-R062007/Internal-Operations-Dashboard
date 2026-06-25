import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:3001'

export default function Metrics() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get(`${API}/dashboard/metrics`)
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load metrics'))
  }, [])

  if (error) return <div className="error">{error}</div>
  if (!data) return <div className="empty">Loading metrics...</div>

  const cards = [
    { label: 'Total Employees', value: data.totalEmployees },
    { label: 'Total Forms', value: data.totalForms },
    { label: 'Pending', value: data.pendingAssignments },
    { label: 'Submitted', value: data.submittedAssignments },
    { label: 'Overdue', value: data.overdueAssignments },
  ]

  return (
    <div>
      <p className="section-title">Dashboard Overview</p>
      <div className="metrics-grid">
        {cards.map(c => (
          <div className="metric-card" key={c.label}>
            <div className="value">{c.value}</div>
            <div className="label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
