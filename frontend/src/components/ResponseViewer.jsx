import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:3001'

const EMPLOYEES = [
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'John Doe' },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Jane Smith' },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Bob Johnson' },
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', name: 'Alice Brown' },
  { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Charlie Wilson' },
]

export default function ResponseViewer() {
  const [selectedId, setSelectedId] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = () => {
    if (!selectedId) return
    setLoading(true)
    setError(null)
    axios.get(`${API}/employee/${selectedId}/responses`)
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load responses'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="card">
      <p className="section-title">Employee Response Viewer</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
          <option value="">Select an employee...</option>
          {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <button className="btn btn-primary" onClick={load} disabled={!selectedId || loading}>
          {loading ? 'Loading...' : 'View'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {data && (
        <div>
          <p style={{ marginBottom: 16, fontWeight: 600 }}>{data.employee.name} — {data.employee.email}</p>
          {data.forms.length === 0 ? <div className="empty">No responses found</div> : data.forms.map((form, i) => (
            <div key={i} style={{ marginBottom: 24, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>{form.form_name} — <span className={`badge ${form.status}`}>{form.status}</span></p>
              {form.responses.length === 0 ? <div className="empty">No responses yet</div> : (
                <table>
                  <thead><tr><th>Question</th><th>Answer</th></tr></thead>
                  <tbody>
                    {form.responses.map((r, j) => (
                      <tr key={j}><td>{r.question}</td><td>{r.answer}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
