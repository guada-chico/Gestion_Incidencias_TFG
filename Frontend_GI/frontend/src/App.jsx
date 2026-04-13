import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { useState } from 'react'

import IncidentList from './pages/IncidentList'
import IncidentDetail from './pages/IncidentDetail'
import IncidentForm from './pages/IncidentForm'
import Login from './components/Login'
import NavBar from './components/NavBar'

import kyoImg from './assets/Kyocera_logo.svg.png'
import kyoImgMini from './assets/kyocera.png'
import './App.css'

/* =========================
    LAYOUT PRINCIPAL (Mantenemos tu estilo exacto)
========================= */
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app-layout">

      {/* SIDEBAR (NORMAL / MINI) */}
      {sidebarOpen ? (
        <aside className="sidebar">
          <NavBar />
        </aside>
      ) : (
        <aside className="sidebar-mini">
          {/* Aquí puedes poner el kyoImgMini si quieres */}
        </aside>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-area">

        {/* HEADER */}
        <header className="hero">

          {/* BOTÓN TOGGLE */}
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <img src={kyoImg} className="base" alt="Kyocera Logo" />
          <h1>Gestión de Incidencias</h1>
        </header>

        {/* PÁGINAS */}
        <main className="main-content">
          <div className="page-wrapper">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}

/* =========================
    APP ROUTER
========================= */
function App() {
  // NUEVO: Estado global para las incidencias
  const [incidents, setIncidents] = useState([]);

  // NUEVO: Función para añadir incidencias
  const addIncident = (newInc) => {
    setIncidents([...incidents, newInc]);
  };

  return (
    <Router>
      <Routes>

        {/* LOGIN SIN SIDEBAR */}
        <Route path="/login" element={<Login />} />

        {/* APP PRINCIPAL - Pasamos los datos a través de context o props */}
        <Route element={<AppLayout />}>
          {/* Usamos el componente de React para inyectar las props en el Outlet o pasarlas directamente */}
          <Route path="/" element={<IncidentList incidents={incidents} setIncidents={setIncidents} />} />
          <Route path="/crear" element={<IncidentForm onAdd={addIncident} />} />
          <Route path="/editar/:id" element={<IncidentForm incidents={incidents} setIncidents={setIncidents} />} />
          <Route path="/incidencia/:id" element={<IncidentDetail incidents={incidents} />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default App