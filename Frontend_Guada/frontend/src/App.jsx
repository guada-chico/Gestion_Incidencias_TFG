import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import IncidentList from './pages/jsx/IncidentList'
import IncidentForm from './pages/jsx/IncidentForm'
import IncidentDetail from './pages/jsx/IncidentDetail'
import Login from './components/jsx/Login'
import Header from './components/jsx/Header'
import { API_BASE_URL, authHeader, getValidToken, removeToken } from './services/api-config'
import './App.css'

function App() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(getValidToken())

  const fetchIncidents = async () => {
    try {
      console.log('Obteniendo incidencias desde:', `${API_BASE_URL}/incidencias`);
      const response = await fetch(`${API_BASE_URL}/incidencias`, {
        headers: authHeader()
      })
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json()
        
const incidenciasList = data.Data || data.data || (Array.isArray(data) ? data : []);

  console.log('Total incidencias recibidas:', incidenciasList.length);
  
  incidenciasList.forEach(inc => {
    const comentariosLocal = localStorage.getItem(`comentarios_${inc.id}`);
    if (!inc.ComentariosJson && !inc.comentariosJson && comentariosLocal) {
      console.log(`✓ Restaurando comentarios de localStorage para incidencia ${inc.id}`);
      inc.ComentariosJson = comentariosLocal;
      inc.comentariosJson = comentariosLocal;
    }
    
    console.log(`Incidencia ${inc.id} (${inc.titulo}):`, {
      ComentariosJson: inc.ComentariosJson,
      comentariosJson: inc.comentariosJson,
      comments: inc.comments
    });
    if (inc.ComentariosJson || inc.comentariosJson) {
      console.log(`✓ Incidencia ${inc.id} - Comentarios encontrados:`, inc.ComentariosJson || inc.comentariosJson);
    } else {
      console.warn(`✗ Incidencia ${inc.id} - SIN COMENTARIOS`);
    }
  });
  
  console.log('Lista final para el estado:', incidenciasList);
  setIncidents(incidenciasList);
      } else {
        console.error('Error en respuesta:', response.statusText);
      }
    } catch (error) {
      console.error("Error conectando con el backend:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchIncidents()
    } else {
      setLoading(false)
    }
  }, [token])

  const handleLogout = () => {
    removeToken()
    setToken(null)
  }

  if (loading) return <div className="loading">Cargando conexión con Fixora API...</div>

  return (
    <Router>
      <div className="app-container">
        {token && <Header onLogout={handleLogout} />}
        
        <main className="main-content">
          <Routes>
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
            
            <Route path="/" element={token ? <IncidentList incidents={incidents} setIncidents={setIncidents} /> : <Navigate to="/login" />} />
            <Route path="/nueva" element={token ? <IncidentForm onAdd={fetchIncidents} /> : <Navigate to="/login" />} />
            <Route path="/editar/:id" element={token ? <IncidentForm incidents={incidents} onAdd={fetchIncidents} /> : <Navigate to="/login" />} />
            <Route path="/incidencia/:id" element={token ? <IncidentDetail incidents={incidents} setIncidents={setIncidents} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App