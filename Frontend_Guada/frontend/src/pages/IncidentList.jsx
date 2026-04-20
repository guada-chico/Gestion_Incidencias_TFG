import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, User, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { deleteIncidencia, getUsuarios } from '../services/incidencias-service';

export default function IncidentList({ incidents, setIncidents }) {
  const [tempSearch, setTempSearch] = useState('');
  const [tempStatus, setTempStatus] = useState('');
  const [tempPriority, setTempPriority] = useState('');
  const [tempUser, setTempUser] = useState('');
  const [users, setUsers] = useState([]);
  const [activeFilters, setActiveFilters] = useState({ search: '', status: '', priority: '', user: '' });

  // Mapeos de Enums
  const estadoMap = { 0: 'Abierta', 1: 'En Progreso', 2: 'Resuelta', 3: 'Cerrada' };
  const prioridadMap = { 0: 'Baja', 1: 'Media', 2: 'Alta', 3: 'Crítica' };

  const getStatusLabel = (estado) => estadoMap[estado] || String(estado);
  const getPriorityLabel = (prioridad) => prioridadMap[prioridad] || String(prioridad);

  console.log('IncidentList recibió incidencias:', incidents);
  console.log('Incidencias count:', incidents?.length);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Borrar incidencia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e5002d',
      confirmButtonText: 'Sí, eliminar'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteIncidencia(id);
      setIncidents(incidents.filter(inc => inc.id !== id));
      Swal.fire('Eliminado', '', 'success');
    } catch (error) {
      console.error('Error borrando incidencia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al borrar',
        text: error.message || 'No se pudo eliminar la incidencia en el servidor',
        confirmButtonColor: '#e5002d'
      });
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsuarios();
        setUsers(data || []);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      }
    };

    loadUsers();
  }, []);

  // Filtro automático: se ejecuta cada vez que cambian los filtros temporales
  useEffect(() => {
    setActiveFilters({ search: tempSearch, status: tempStatus, priority: tempPriority, user: tempUser });
  }, [tempSearch, tempStatus, tempPriority, tempUser]);

  const filteredIncidents = incidents.filter(inc => {
    // Convertir enums a strings para comparar (usar camelCase como devuelve el backend)
    const incidenciaEstado = getStatusLabel(inc.estado);
    const incidenciaPrioridad = getPriorityLabel(inc.prioridad);
    const incidenciaUsuario = inc.usuarioAsignado?.trim() || '';
    
    const matchesSearch = !activeFilters.search || inc.titulo?.toLowerCase().includes(activeFilters.search.toLowerCase());
    const matchesStatus = !activeFilters.status || incidenciaEstado === activeFilters.status;
    const matchesPriority = !activeFilters.priority || incidenciaPrioridad === activeFilters.priority;
    const matchesUser = !activeFilters.user || incidenciaUsuario.toLowerCase() === activeFilters.user.toLowerCase();
    
    const matches = matchesSearch && matchesStatus && matchesPriority && matchesUser;
    console.log('Incidencia:', inc.titulo, '| Estado:', inc.estado, '(', incidenciaEstado, ') | Usuario:', incidenciaUsuario, '| Matches:', matches);
    
    return matches;
  });

  console.log('Filtered incidents:', filteredIncidents.length);

  // CORRECCIÓN: El backend devuelve EnProgreso sin espacio (según Estado.cs)
  const getStatusColor = (s) => ({
    'Abierta': '#3498db', 
    'En Progreso': '#f39c12', 
    'Resuelta': '#2ecc71', 
    'Cerrada': '#646464'
  }[s] || '#ccc');

  const getPriorityColor = (p) => ({
    'Baja': '#2ecc71', 
    'Media': '#f1c40f', 
    'Alta': '#e67e22', 
    'Crítica': '#e74c3c'
  }[p] || '#ccc');

  return (
    <div className="incident-page">
      <h2 className="page-title">Listado de Incidencias</h2>

      <form className="search-form">
        <input 
          className="search-input flex-2" 
          type="text" 
          placeholder="Buscar incidencia..." 
          value={tempSearch} 
          onChange={(e) => setTempSearch(e.target.value)} 
        />
        <select className="search-input flex-1" value={tempStatus} onChange={(e) => setTempStatus(e.target.value)}>
          <option value="">Estados</option>
          <option value="Abierta">Abierta</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Resuelta">Resuelta</option>
          <option value="Cerrada">Cerrada</option>
        </select>
        <select className="search-input flex-1" value={tempPriority} onChange={(e) => setTempPriority(e.target.value)}>
          <option value="">Prioridades</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
          <option value="Crítica">Crítica</option>
        </select>
        <select className="search-input flex-1" value={tempUser} onChange={(e) => setTempUser(e.target.value)}>
          <option value="">Usuarios</option>
          {Array.from(new Set((users.length ? users : incidents)
            .map(u => (u.email || u.Email || u.usuarioAsignado || '').trim())
            .filter(Boolean)))
            .map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
        </select>
      </form>

      <div className="incident-grid">
        {filteredIncidents.map(incident => (
          <div key={incident.id} className="incident-card">
            <div className="card-header">
              {/* Convertir enums a strings usando mapeos */}
              <span style={{ color: getStatusColor(getStatusLabel(incident.estado)) }} className="status-badge">
                {getStatusLabel(incident.estado).toUpperCase()}
              </span>
              <span style={{ color: getPriorityColor(getPriorityLabel(incident.prioridad)) }} className="priority-badge">
                {getPriorityLabel(incident.prioridad).toUpperCase()}
              </span>
            </div>
            
            <h3 className="card-title">
              {incident.titulo}
            </h3>
            
            <div className="card-footer-content">
              <p className="info-row assigned-row">
                <User size={20}/> 
                <span>Asignado a: {incident.usuarioAsignado || 'Sin asignar'}</span>
              </p>
              <p className="info-row date-row">
                <Calendar size={20}/> 
                <span>Fecha creación: {new Date(incident.fechaCreacion).toLocaleDateString()}</span>
              </p>
              
              <div className="card-actions">
                <Link className="btn btn-detail" to={`/incidencia/${incident.id}`}>
                  <Eye size={18}/> Detalle
                </Link>
                <Link className="btn btn-edit" to={`/editar/${incident.id}`}>
                  <Edit3 size={18}/> Editar
                </Link>
                <button className="btn btn-danger" onClick={() => handleDelete(incident.id)}>
                  <Trash2 size={18}/> Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredIncidents.length === 0 && <p className="no-results">No se encontraron incidencias.</p>}
      </div>
    </div>
  );
}