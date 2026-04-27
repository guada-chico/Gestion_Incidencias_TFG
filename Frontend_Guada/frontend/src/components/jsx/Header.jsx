import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import logoImg from '../../assets/logo_sintexto_sf.png'; 
import gestorImg from '../../assets/GESTOR_sf.png';
import '../css/Header.css';

export default function Header({ onLogout }) {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <header className="header-global">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src={logoImg} className="header-logo" alt="Logo Fixora" />
        </Link>

        <img src={gestorImg} className="header-gestor" alt="Gestor de Incidencias" />

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