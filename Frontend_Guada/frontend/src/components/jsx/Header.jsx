import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import logoImg from '../../assets/logo_fixora_sf.png'; 
import '../css/Header.css';

export default function Header({ onLogout }) {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <header className="header-global">
      <div className="header-left">
        <a href="https://www.kyoceradocumentsolutions.es" target="_blank" rel="noopener noreferrer" className="logo-link">
          <img src={logoImg} className="header-logo" alt="Logo Fixora" />
        </a>
        
        <h1 className="header-title">Gestión de Incidencias</h1>
      </div>

      <nav className="nav-links">
        <Link to="/">Ver Incidencias</Link>
        <Link to="/nueva">Nueva Incidencia</Link>
        <button onClick={handleLogout} className="logout-icon-btn" title="Cerrar Sesión" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <LogOut size={24} />
        </button>
      </nav>
    </header>
  );
}