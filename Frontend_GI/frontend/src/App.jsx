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
   LAYOUT PRINCIPAL
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
  return (
    <Router>
      <Routes>

        {/* LOGIN SIN SIDEBAR */}
        <Route path="/login" element={<Login />} />

        {/* APP PRINCIPAL */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<IncidentList />} />
          <Route path="/crear" element={<IncidentForm />} />
          <Route path="/editar/:id" element={<IncidentForm />} />
          <Route path="/incidencia/:id" element={<IncidentDetail />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default App