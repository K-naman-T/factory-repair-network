import { useEffect, useMemo, useState } from 'react'

const API_BASE = 'http://localhost:8000'

function useData(path) {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}${path}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData([]))
  }, [path])

  return [data, setData]
}

function App() {
  const [passwordInput, setPasswordInput] = useState('')
  const [adminPassword, setAdminPassword] = useState(localStorage.getItem('adminPassword') || '')
  const path = useMemo(() => window.location.pathname, [])

  const [calls] = useData('/api/calls')
  const [jobs] = useData('/api/jobs')
  const [technicians, setTechnicians] = useData('/api/technicians')
  const [factories, setFactories] = useData('/api/factories')

  const [techForm, setTechForm] = useState({ name: '', specialty: 'HVAC', city: '', phone: '' })
  const [factoryForm, setFactoryForm] = useState({ name: '', address: '', city: '', phone: '' })

  const handleLogin = (e) => {
    e.preventDefault()
    localStorage.setItem('adminPassword', passwordInput)
    setAdminPassword(passwordInput)
    window.location.href = '/admin/calls'
  }

  const addTechnician = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/api/technicians?password=${encodeURIComponent(adminPassword)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(techForm),
    })
    if (res.ok) {
      setTechnicians([...technicians, { ...techForm, available: 1, rating: 4.5 }])
      setTechForm({ name: '', specialty: 'HVAC', city: '', phone: '' })
    }
  }

  const addFactory = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/api/factories?password=${encodeURIComponent(adminPassword)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(factoryForm),
    })
    if (res.ok) {
      setFactories([...factories, factoryForm])
      setFactoryForm({ name: '', address: '', city: '', phone: '' })
    }
  }

  if (path === '/admin') {
    return (
      <main className="layout">
        <h1>Factory Repair Network Admin</h1>
        <form onSubmit={handleLogin} className="card form-grid">
          <label>Admin Password</label>
          <input value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} type="password" required />
          <button type="submit">Login</button>
          <small>Use backend password (default: factory123)</small>
        </form>
      </main>
    )
  }

  return (
    <main className="layout">
      <h1>Factory Repair Network Dashboard</h1>
      <nav className="nav">
        <a href="/admin/calls">Calls</a>
        <a href="/admin/jobs">Jobs</a>
        <a href="/admin/technicians">Technicians</a>
        <a href="/admin/factories">Factories</a>
      </nav>

      {path === '/admin/calls' && (
        <section className="card">
          <h2>Call Logs</h2>
          {calls.map((call) => (
            <p key={call.id}>{call.created_at} | {call.phone} | {call.intent} | {call.transcript || 'No transcript'}</p>
          ))}
        </section>
      )}

      {path === '/admin/jobs' && (
        <section className="card">
          <h2>Jobs</h2>
          {jobs.map((job) => (
            <p key={job.id}>#{job.id} | {job.specialty_needed} | {job.status} | {job.factory_name || 'Unknown factory'} | Rs {job.cost}</p>
          ))}
        </section>
      )}

      {path === '/admin/technicians' && (
        <section className="card">
          <h2>Technicians</h2>
          <form onSubmit={addTechnician} className="form-grid">
            <input placeholder="Name" value={techForm.name} onChange={(e) => setTechForm({ ...techForm, name: e.target.value })} required />
            <input placeholder="Specialty" value={techForm.specialty} onChange={(e) => setTechForm({ ...techForm, specialty: e.target.value })} required />
            <input placeholder="City" value={techForm.city} onChange={(e) => setTechForm({ ...techForm, city: e.target.value })} required />
            <input placeholder="Phone" value={techForm.phone} onChange={(e) => setTechForm({ ...techForm, phone: e.target.value })} required />
            <button type="submit">Add Technician</button>
          </form>
          {technicians.map((tech) => (
            <p key={tech.id || tech.phone}>{tech.name} | {tech.specialty} | {tech.city} | {tech.phone}</p>
          ))}
        </section>
      )}

      {path === '/admin/factories' && (
        <section className="card">
          <h2>Factories</h2>
          <form onSubmit={addFactory} className="form-grid">
            <input placeholder="Name" value={factoryForm.name} onChange={(e) => setFactoryForm({ ...factoryForm, name: e.target.value })} required />
            <input placeholder="Address" value={factoryForm.address} onChange={(e) => setFactoryForm({ ...factoryForm, address: e.target.value })} required />
            <input placeholder="City" value={factoryForm.city} onChange={(e) => setFactoryForm({ ...factoryForm, city: e.target.value })} required />
            <input placeholder="Phone" value={factoryForm.phone} onChange={(e) => setFactoryForm({ ...factoryForm, phone: e.target.value })} required />
            <button type="submit">Add Factory</button>
          </form>
          {factories.map((factory) => (
            <p key={factory.id || factory.phone}>{factory.name} | {factory.city} | {factory.phone}</p>
          ))}
        </section>
      )}
    </main>
  )
}

export default App
