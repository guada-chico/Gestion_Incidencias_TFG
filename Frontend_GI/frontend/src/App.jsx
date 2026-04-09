// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import IncidentForm from './pages/IncidentForm';
import Header from './components/Header'; // Importamos el Header actualizado
import NavBar from './components/NavBar';
import Login from './components/Login';
import './App.css';

function AppContent() {
  const location = useLocation();
  // El NavBar NO sale en login
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {/* El Header con la imagen y h1 sale SIEMPRE */}
      <Header />

      {/* El NavBar NO sale si estamos en /login */}
      {!isLoginPage && <NavBar />}

      <main>
        <Routes>
          <Route path="/" element={<IncidentList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/crear" element={<IncidentForm />} />
          <Route path="/editar/:id" element={<IncidentForm />} />
          <Route path="/incidencia/:id" element={<IncidentDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}