import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:3001'

export default function ReminderPanel() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const sendReminders = () => {
    setLoading(true)
    setError(null)
    setResult(null)
    axios.post(`${API}/assignments/send-reminders`)
      .then(res => setResult(res.data))
      .catch(() => setError('Failed to send reminders'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="card">
      <p className="section-title">Reminder Actions</p>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
        Sends reminder emails to all employees with pending assignments due within 24 hours or overdue.
      </p>
      <button className="btn btn-primary" onClick={sendReminders} disabled={loading}>
        {loading ? 'Sending...' : 'Send Reminders to Pending Employees'}
      </button>
      {error && <div className="error" style={{ marginTop: 16 }}>{error}</div>}
      {result && (
        <div className="summary-box">
          <p><strong>Checked:</strong> {result.checked}</p>
          <p><strong>Reminders Sent:</strong> {result.remindersSent}</p>
          <p><strong>Skipped:</strong> {result.skipped}</p>
          <p><strong>Failed:</strong> {result.failed}</p>
        </div>
      )}
    </div>
  )
}
