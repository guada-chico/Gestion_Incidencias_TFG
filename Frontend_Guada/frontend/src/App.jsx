import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import IncidentList from './pages/IncidentList'
import IncidentForm from './pages/IncidentForm'
import IncidentDetail from './pages/IncidentDetail'
import Login from './components/Login'
import Header from './components/Header'
import { API_BASE_URL, authHeader, getValidToken, removeToken } from './services/api-config'
import './App.css'

function App() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(getValidToken())

  // 1. FUNCIÓN PARA CARGAR DATOS DEL BACKEND
  const fetchIncidents = async () => {
    try {
      console.log('Obteniendo incidencias desde:', `${API_BASE_URL}/incidencias`);
      const response = await fetch(`${API_BASE_URL}/incidencias`, {
        headers: authHeader() // Enviamos el token para que el Back nos deje pasar
      })
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json()
        
const incidenciasList = data.Data || data.data || (Array.isArray(data) ? data : []);

  // Log para verificar que los comentarios se están trayendo del backend
  console.log('Total incidencias recibidas:', incidenciasList.length);
  
  // Si el backend no devuelve ComentariosJson, intentamos recuperarlo de localStorage
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
    removeToken()
    setToken(null)
  }

  if (loading) return <div className="loading">Cargando conexión con Kyocera API...</div>

  return (
    <Router>
      <div className="app-container">
        {/* Solo mostramos la Header si el usuario está logueado */}
        {token && <Header onLogout={handleLogout} />}
        
        <main className="main-content">
          <Routes>
            {/* Si no hay token, mandamos siempre al Login */}
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
            
            {/* Rutas Protegidas */}
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