import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import IncidentList from './pages/IncidentList'
import IncidentDetail from './pages/IncidentDetail'
import IncidentForm from './pages/IncidentForm'
import Login from './components/Login'
import Header from './components/Header'
import * as api from './services/incidencias-service' // Importamos tu lógica de conexión
import './App.css'

function AppLayout() {
  // Verificación básica de seguridad: si no hay token, al login
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Header /> 
      <main className="main-content">
        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar incidencias desde el Backend al iniciar
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.getIncidencias(); 
          // Según tu controlador, los datos vienen en la propiedad 'data'
          setIncidents(response.data); 
        }
      } catch (error) {
        console.error("Error cargando incidencias del servidor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Función para refrescar la lista después de crear/editar/borrar
  const refreshData = async () => {
    const response = await api.getIncidencias();
    setIncidents(response.data);
  };

  if (loading) return <div>Cargando sistema de incidencias...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<IncidentList incidents={incidents} setIncidents={setIncidents} onRefresh={refreshData} />} />
          <Route path="/crear" element={<IncidentForm onRefresh={refreshData} />} />
          <Route path="/editar/:id" element={<IncidentForm onRefresh={refreshData} />} />
          <Route path="/incidencia/:id" element={<IncidentDetail onRefresh={refreshData} />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;