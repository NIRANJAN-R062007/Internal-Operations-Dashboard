import { useState } from 'react'
import Metrics from './components/Metrics'
import Assignments from './components/Assignments'
import ResponseViewer from './components/ResponseViewer'
import ReminderPanel from './components/ReminderPanel'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="app">
      <header className="header">
        <h1>Hechaar Operations Dashboard</h1>
        <nav className="nav">
          <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'active' : ''}>Overview</button>
          <button onClick={() => setActiveTab('assignments')} className={activeTab === 'assignments' ? 'active' : ''}>Assignments</button>
          <button onClick={() => setActiveTab('responses')} className={activeTab === 'responses' ? 'active' : ''}>Responses</button>
          <button onClick={() => setActiveTab('reminders')} className={activeTab === 'reminders' ? 'active' : ''}>Reminders</button>
        </nav>
      </header>
      <main className="main">
        {activeTab === 'overview' && <Metrics />}
        {activeTab === 'assignments' && <Assignments />}
        {activeTab === 'responses' && <ResponseViewer />}
        {activeTab === 'reminders' && <ReminderPanel />}
      </main>
    </div>
  )
}
