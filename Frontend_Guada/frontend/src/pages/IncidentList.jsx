import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, User, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { deleteIncidencia, getUsuarios } from '../Services/incidencias-service';

export default function IncidentList({ incidents = [], setIncidents }) {
  const [tempSearch, setTempSearch] = useState('');
  const [tempStatus, setTempStatus] = useState('');
  const [tempPriority, setTempPriority] = useState('');
  const [tempUser, setTempUser] = useState('');
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUserDisplay, setSelectedUserDisplay] = useState('Usuario asignado');

  const estadoMap = { 0: 'Abierta', 1: 'En Progreso', 2: 'Resuelta', 3: 'Cerrada' };
  const prioridadMap = { 0: 'Baja', 1: 'Media', 2: 'Alta', 3: 'Crítica' };

  const getStatusLabel = (estado) => estadoMap[estado] || String(estado);
  const getPriorityLabel = (prioridad) => prioridadMap[prioridad] || String(prioridad);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsuarios();
        
        // 1. Usuarios reales de la base de datos (evitamos nombres nulos aquí)
        let apiUsers = (data || [])
          .map(u => u.nombreReal || u.nombre)
          .filter(Boolean);

        // 2. Nombres que aparecen en las incidencias actuales
        const incidentUsers = (incidents || [])
          .map(inc => inc.usuarioAsignado?.trim())
          .filter(Boolean);

        // 3. Combinamos ambos en un Set para quitar duplicados
        const combinedNames = new Set([...apiUsers, ...incidentUsers]);
        
        // 4. Creamos la lista final de objetos
        const finalUserList = Array.from(combinedNames).map((name, index) => ({
          id: `user-${index}`,
          nombre: name
        }));

        // 5. SI hay alguna incidencia sin usuario, añadimos la opción "Sin asignar" al principio
        const tieneIncidenciasSinAsignar = (incidents || []).some(inc => !inc.usuarioAsignado?.trim());
        if (tieneIncidenciasSinAsignar) {
          finalUserList.unshift({ id: 'unassigned', nombre: 'Sin asignar' });
        }

        setUsers(finalUserList);

      } catch (error) {
        console.error('Error cargando usuarios:', error);
        const fallback = [...new Set((incidents || []).map(inc => inc.usuarioAsignado?.trim()).filter(Boolean))];
        setUsers(fallback.map((n, i) => ({ id: i, nombre: n })));
      }
    };
    loadUsers();
  }, [incidents]);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserDropdown && !e.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  // --- LÓGICA DE FILTRADO CORREGIDA PARA "Sin asignar" ---
  const filteredIncidents = (incidents || []).filter(inc => {
    const matchesSearch = !tempSearch || inc.titulo?.toLowerCase().includes(tempSearch.toLowerCase());
    const matchesStatus = !tempStatus || getStatusLabel(inc.estado) === tempStatus;
    const matchesPriority = !tempPriority || getPriorityLabel(inc.prioridad) === tempPriority;
    
    // Lógica especial para el filtro de usuario
    let matchesUser = true;
    if (tempUser) {
      if (tempUser === 'Sin asignar') {
        // Si el filtro es "Sin asignar", buscamos incidencias cuyo campo esté vacío
        matchesUser = !inc.usuarioAsignado || inc.usuarioAsignado.trim() === '';
      } else {
        // Busqueda normal por nombre
        matchesUser = inc.usuarioAsignado?.trim() === tempUser;
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesUser;
  });

  const getStatusColor = (s) => ({ 'Abierta': '#3498db', 'En Progreso': '#f39c12', 'Resuelta': '#2ecc71', 'Cerrada': '#646464' }[s] || '#ccc');
  const getPriorityColor = (p) => ({ 'Baja': '#2ecc71', 'Media': '#f1c40f', 'Alta': '#e67e22', 'Crítica': '#e74c3c' }[p] || '#ccc');

  return (
    <div className="incident-page">
      <h2 className="page-title">Listado de Incidencias</h2>

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

        <div className="user-dropdown-container">
          <div
            className={`user-dropdown-trigger ${showUserDropdown ? 'active' : ''}`}
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <span className="selected-text">{selectedUserDisplay}</span>
            <div className="arrow-wrapper">
              {tempUser && <span className="clear-user-x" onClick={handleClearUser}>✕</span>}
              <span className="svg-arrow"></span>
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
                <button className="btn btn-danger" onClick={() => handleDelete(incident.id)}><Trash2 size={18}/> Borrar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}