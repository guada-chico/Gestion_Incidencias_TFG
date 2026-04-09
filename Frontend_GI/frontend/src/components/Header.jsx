// src/components/Header.jsx
import { Link } from 'react-router-dom';
// Asegúrate de tener una imagen en src/assets/logo.png o cambia la ruta
import logoImg from '../assets/Kyocera_logo.svg.png'; 

export default function Header() {
  return (
    <header className="header-global">
      <Link to="/" className="header-logo-link">
        <img src={logoImg} alt="Logo Kyocera" className="header-logo" />
      </Link>
      <h1 className="header-title">Gestión de Incidencias</h1>
    </header>
  );
}