import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import IncidentList from './pages/IncidentList'
import IncidentDetail from './pages/IncidentDetail'
import IncidentForm from './pages/IncidentForm'
import Login from './components/Login'
import './App.css'

function App() {
  return (
    <Router>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<IncidentList />} />
          <Route path="/crear" element={<IncidentForm />} />
          <Route path="/editar/:id" element={<IncidentForm />} />
          <Route path="/incidencia/:id" element={<IncidentDetail />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App