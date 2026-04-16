import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import logoImg from '../assets/Kyocera_logo.svg.png'; 
import './Header.css';

export default function Header() {
  return (
    <header className="header-global">
      <div className="header-left">
        <a href="https://www.kyoceradocumentsolutions.es" target="_blank" rel="noopener noreferrer" className="logo-link">
          <img src={logoImg} className="header-logo" alt="Logo Kyocera" />
        </a>
        
        <h1 className="header-title">Gestión de Incidencias</h1>
      </div>

      <nav className="nav-links">
        <Link to="/">Ver Incidencias</Link>
        <Link to="/crear">Nueva Incidencia</Link>
        <Link to="/login" className="logout-icon-btn" title="Cerrar Sesión">
          <LogOut size={24} />
        </Link>
      </nav>
    </header>
  );
}