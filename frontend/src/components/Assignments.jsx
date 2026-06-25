import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:3001'

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [filter, setFilter] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const url = filter ? `${API}/assignments?status=${filter}` : `${API}/assignments`
    axios.get(url)
      .then(res => setAssignments(res.data.assignments))
      .catch(() => setError('Failed to load assignments'))
  }, [filter])

  const getBadge = (status, due) => {
    if (status === 'Pending' && new Date(due) < new Date()) return 'Overdue'
    return status
  }

  if (error) return <div className="error">{error}</div>

  return (
    <div className="card">
      <p className="section-title">Form Assignments</p>
      <div className="filter-bar">
        {['', 'Pending', 'Submitted', 'overdue'].map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {assignments.length === 0 ? (
        <div className="empty">No assignments found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Form</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => {
              const badge = getBadge(a.status, a.due_date)
              return (
                <tr key={a.id}>
                  <td>{a.employees?.employee_name}</td>
                  <td>{a.engagement_forms?.name}</td>
                  <td><span className={`badge ${badge}`}>{badge}</span></td>
                  <td>{new Date(a.due_date).toLocaleDateString()}</td>
                  <td>{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
