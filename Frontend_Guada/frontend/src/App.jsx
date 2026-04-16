import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import IncidentList from './pages/IncidentList'
import IncidentForm from './pages/IncidentForm'
import IncidentDetail from './pages/IncidentDetail'
import Login from './components/Login'
import { API_BASE_URL, authHeader } from './services/api-config'
import './App.css'

function App() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // 1. FUNCIÓN PARA CARGAR DATOS DEL BACKEND
  const fetchIncidents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidencias`, {
        headers: authHeader() // Enviamos el token para que el Back nos deje pasar
      })
      if (response.ok) {
        const data = await response.json()
        setIncidents(data) // Guardamos las incidencias reales
      }
    } catch (error) {
      console.error("Error conectando con el backend:", error)
    } finally {
      setLoading(false)
    }
  }

  // 2. CARGAR AL INICIO (Y cada vez que el token cambie)
  useEffect(() => {
    if (token) {
      fetchIncidents()
    } else {
      setLoading(false)
    }
  }, [token])

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (loading) return <div className="loading">Cargando conexión con Kyocera API...</div>

  return (
    <Router>
      <div className="app-container">
        {/* Solo mostramos la NavBar si el usuario está logueado */}
        {token && <NavBar onLogout={handleLogout} />}
        
        <main className="main-content">
          <Routes>
            {/* Si no hay token, mandamos siempre al Login */}
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
            
            {/* Rutas Protegidas */}
            <Route path="/" element={token ? <IncidentList incidents={incidents} setIncidents={setIncidents} /> : <Navigate to="/login" />} />
            <Route path="/nueva" element={token ? <IncidentForm onAdd={fetchIncidents} /> : <Navigate to="/login" />} />
            <Route path="/editar/:id" element={token ? <IncidentForm incidents={incidents} onAdd={fetchIncidents} /> : <Navigate to="/login" />} />
            <Route path="/incidencia/:id" element={token ? <IncidentDetail incidents={incidents} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App