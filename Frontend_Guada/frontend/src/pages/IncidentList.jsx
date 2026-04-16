import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Edit3, Trash2, User, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

export default function IncidentList({ incidents, setIncidents }) {
  const [tempSearch, setTempSearch] = useState('');
  const [tempStatus, setTempStatus] = useState('');
  const [tempPriority, setTempPriority] = useState('');
  const [activeFilters, setActiveFilters] = useState({ search: '', status: '', priority: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveFilters({ search: tempSearch, status: tempStatus, priority: tempPriority });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Borrar incidencia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e5002d',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIncidents(incidents.filter(inc => inc.id !== id));
        Swal.fire('Eliminado', '', 'success');
      }
    });
  };

  const filteredIncidents = incidents.filter(inc => {
    return inc.title.toLowerCase().includes(activeFilters.search.toLowerCase()) &&
           (activeFilters.status === '' || inc.status === activeFilters.status) &&
           (activeFilters.priority === '' || inc.priority === activeFilters.priority);
  });

  const getStatusColor = (s) => ({'Abierta': '#3498db', 'EnProceso': '#f39c12', 'Resuelta': '#2ecc71', 'Cerrada': '#646464'}[s] || '#ccc');
  const getPriorityColor = (p) => ({'Baja': '#2ecc71', 'Media': '#f1c40f', 'Alta': '#e67e22', 'Crítica': '#e74c3c'}[p] || '#ccc');

  return (
    <div className="incident-page">
      <h2 className="page-title">Listado de Incidencias</h2>

      <form onSubmit={handleSearch} className="search-form">
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
          <option value="EnProceso">En proceso</option>
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
        <button type="submit" className="btn-search">
          <Search size={18}/> BUSCAR
        </button>
      </form>

      <div className="incident-grid">
        {filteredIncidents.map(incident => (
          <div key={incident.id} className="incident-card">
            <div className="card-header">
              <span style={{ color: getStatusColor(incident.status) }} className="status-badge">
                {incident.status.toUpperCase()}
              </span>
              <span style={{ color: getPriorityColor(incident.priority) }} className="priority-badge">
                {incident.priority.toUpperCase()}
              </span>
            </div>
            
            <h3 className="card-title">
              {incident.title}
            </h3>
            
            {/* Contenedor que se alinea al fondo de la card */}
            <div className="card-footer-content">
              <p className="info-row assigned-row">
                <User size={20}/> <span>Asignado a: {incident.assignedUser || 'Sin asignar'}</span>
              </p>
              <p className="info-row date-row">
                <Calendar size={20}/> <span>Fecha creación: {incident.FechaCreacion}</span>
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
      </div>
    </div>
  );
}