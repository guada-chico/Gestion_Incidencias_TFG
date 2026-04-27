import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, User, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { deleteIncidencia, getUsuarios } from '../../Services/incidencias-service';
import { jwtDecode } from 'jwt-decode';
import '../css/IncidentList.css';
import listadoImg from '../../assets/logo_listado_sf.png';

export default function IncidentList({ incidents = [], setIncidents }) {
  const [tempSearch, setTempSearch] = useState('');
  const [tempStatus, setTempStatus] = useState('');
  const [tempPriority, setTempPriority] = useState('');
  const [tempUser, setTempUser] = useState('');
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUserDisplay, setSelectedUserDisplay] = useState('Usuario asignado');

  // Lógica de Roles: Extraemos el rol del token con soporte para el formato largo de .NET
  const token = localStorage.getItem('token');
  let userRole = 'User';
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // .NET genera el rol en esta URL larga. Buscamos ahí primero.
      userRole = 
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
        decoded.role || 
        'User';
        
      // Descomenta la siguiente línea para depurar en la consola si sigue fallando:
      // console.log("Rol detectado:", userRole);
    } catch (e) {
      console.error("Error al decodificar el token", e);
    }
  }
  
  const isAdmin = userRole === 'Admin';

  const estadoMap = { 0: 'Abierta', 1: 'En Progreso', 2: 'Resuelta', 3: 'Cerrada' };
  const prioridadMap = { 0: 'Baja', 1: 'Media', 2: 'Alta', 3: 'Crítica' };

  const getStatusLabel = (estado) => estadoMap[estado] || String(estado);
  const getPriorityLabel = (prioridad) => prioridadMap[prioridad] || String(prioridad);

  useEffect(() => {
    const loadUsers = async () => {
      if (!isAdmin) return;
      try {
        const data = await getUsuarios();
        let apiUsers = (data || []).map(u => u.nombreReal || u.nombre).filter(Boolean);
        const incidentUsers = (incidents || []).map(inc => inc.usuarioAsignado?.trim()).filter(Boolean);
        const combinedNames = new Set([...apiUsers, ...incidentUsers]);
        
        const finalUserList = Array.from(combinedNames).map((name, index) => ({
          id: `user-${index}`,
          nombre: name
        }));

        if ((incidents || []).some(inc => !inc.usuarioAsignado?.trim())) {
          finalUserList.unshift({ id: 'unassigned', nombre: 'Sin asignar' });
        }
        setUsers(finalUserList);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      }
    };
    loadUsers();
  }, [incidents, isAdmin]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Borrar incidencia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e5002d',
      confirmButtonText: 'Sí, eliminar'
    });
    if (result.isConfirmed) {
      try {
        await deleteIncidencia(id);
        setIncidents(incidents.filter(inc => inc.id !== id));
        Swal.fire('Eliminado', '', 'success');
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error al borrar', confirmButtonColor: '#e5002d' });
      }
    }
  };

  const handleUserSelect = (user) => {
    setTempUser(user.nombre);
    setSelectedUserDisplay(user.nombre);
    setUserSearch('');
    setShowUserDropdown(false);
  };

  const handleClearUser = (e) => {
    e.stopPropagation();
    setTempUser('');
    setSelectedUserDisplay('Usuario asignado');
    setUserSearch('');
    setShowUserDropdown(false);
  };

  const filteredIncidents = (incidents || []).filter(inc => {
    const matchesSearch = !tempSearch || inc.titulo?.toLowerCase().includes(tempSearch.toLowerCase());
    const matchesStatus = !tempStatus || getStatusLabel(inc.estado) === tempStatus;
    const matchesPriority = !tempPriority || getPriorityLabel(inc.prioridad) === tempPriority;
    
    let matchesUser = true;
    if (tempUser) {
      if (tempUser === 'Sin asignar') {
        matchesUser = !inc.usuarioAsignado || inc.usuarioAsignado.trim() === '';
      } else {
        matchesUser = inc.usuarioAsignado?.trim() === tempUser;
      }
    }
    return matchesSearch && matchesStatus && matchesPriority && matchesUser;
  });

  const getStatusColor = (s) => ({ 'Abierta': '#3498db', 'En Progreso': '#f39c12', 'Resuelta': '#2ecc71', 'Cerrada': '#646464' }[s] || '#ccc');
  const getPriorityColor = (p) => ({ 'Baja': '#2ecc71', 'Media': '#f1c40f', 'Alta': '#e67e22', 'Crítica': '#e74c3c' }[p] || '#ccc');

  return (
    <div className="incident-page">
      <img src={listadoImg} alt="Listado de Incidencias" />

      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <input
          className="search-input"
          type="text"
          placeholder="Buscar incidencia..."
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
        />
        
        <select className="search-input" value={tempStatus} onChange={(e) => setTempStatus(e.target.value)}>
          <option value="">Estados</option>
          <option value="Abierta">Abierta</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Resuelta">Resuelta</option>
          <option value="Cerrada">Cerrada</option>
        </select>

        <select className="search-input" value={tempPriority} onChange={(e) => setTempPriority(e.target.value)}>
          <option value="">Prioridades</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
          <option value="Crítica">Crítica</option>
        </select>

        {isAdmin && (
          <div className="user-dropdown-container">
            <div
              className={`user-dropdown-trigger ${showUserDropdown ? 'active' : ''}`}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <span className="selected-text">{selectedUserDisplay}</span>
              <div className="arrow-wrapper">
                {tempUser && <span className="clear-user-x" onClick={handleClearUser}>✕</span>}
              </div>
            </div>
            {showUserDropdown && (
              <div className="user-dropdown">
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="user-search-input-inner"
                  autoFocus
                />
                <div className="user-list">
                  {users
                    .filter(u => u.nombre.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((user) => (
                      <div key={user.id} className="user-dropdown-item" onClick={() => handleUserSelect(user)}>
                        {user.nombre}
                      </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>

      <div className="incident-grid">
        {filteredIncidents.map(incident => (
          <div key={incident.id} className="incident-card">
            <div className="card-header">
              <span style={{ color: getStatusColor(getStatusLabel(incident.estado)) }} className="status-badge">
                {getStatusLabel(incident.estado).toUpperCase()}
              </span>
              <span style={{ color: getPriorityColor(getPriorityLabel(incident.prioridad)) }} className="priority-badge">
                {getPriorityLabel(incident.prioridad).toUpperCase()}
              </span>
            </div>
            <h3 className="card-title">{incident.titulo}</h3>
            <div className="card-footer-content">
              <p className="info-row assigned-row">
                <User size={20}/> <span>Asignado a: {incident.usuarioAsignado || 'Sin asignar'}</span>
              </p>
              <p className="info-row date-row">
                <Calendar size={20}/> <span>Fecha: {incident.fechaCreacion ? new Date(incident.fechaCreacion).toLocaleDateString() : 'N/A'}</span>
              </p>
              <div className="card-actions">
                <Link className="btn btn-detail" to={`/incidencia/${incident.id}`}><Eye size={18}/> Detalle</Link>
                <Link className="btn btn-edit" to={`/editar/${incident.id}`}><Edit3 size={18}/> Editar</Link>
                {isAdmin && (
                  <button className="btn btn-danger" onClick={() => handleDelete(incident.id)}><Trash2 size={18}/> Borrar</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}