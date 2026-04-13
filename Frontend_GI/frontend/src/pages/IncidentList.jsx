import { useState } from 'react';
import { Link } from 'react-router-dom';

// Recibimos 'incidents' y 'setIncidents' como props desde App.jsx
export default function IncidentList({ incidents, setIncidents }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas borrar esta incidencia?')) {
      // Borramos del estado global
      setIncidents(incidents.filter(inc => inc.id !== id));
      alert('Incidencia borrada con éxito');
    }
  };

  const filteredIncidents = incidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mantenemos tus funciones de colores intactas
  const getStatusColor = (status) => {
    switch (status) {
      case 'abierta': return '#3498db';
      case 'en proceso': return '#f39c12';
      case 'resuelta': return '#2ecc71';
      case 'cerrada': return '#7f8c8d';
      default: return '#ccc';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'baja': return '#2ecc71';
      case 'media': return '#f1c40f';
      case 'alta': return '#e67e22';
      case 'critica': return '#e74c3c';
      default: return '#ccc';
    }
  };

  // Eliminamos el bloque de 'loading' porque ahora los datos son locales e instantáneos

  return (
    <div className="incident-page">
      <h2>Listado de Incidencias</h2>

      {/* BUSCADOR - Mantenemos tu clase search-input */}
      <input
        className="search-input"
        type="text"
        placeholder="Buscar incidencias..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* GRID - Mantenemos tu estructura de tarjetas original */}
      <div className="incident-grid">
        {filteredIncidents.map(incident => (
          <div key={incident.id} className="incident-card">

            {/* BADGES - Mantienen tu estilo y lógica de color */}
            <div style={{ marginBottom: '10px' }}>
              <span
                className="badge"
                style={{ background: getStatusColor(incident.status) }}
              >
                {incident.status}
              </span>

              <span
                className="badge"
                style={{ background: getPriorityColor(incident.priority) }}
              >
                {incident.priority}
              </span>
            </div>

            {/* TÍTULO */}
            <h3>{incident.title}</h3>

            {/* ACCIONES - Mantenemos tus clases btn, btn-danger y btn-edit */}
            <div style={{ marginTop: '10px' }}>
              <Link to={`/incidencia/${incident.id}`}>
                Ver detalle
              </Link>

              <button
                className="btn btn-danger"
                onClick={() => handleDelete(incident.id)}
                style={{ marginLeft: '10px' }}
              >
                Borrar
              </button>

              <Link
                className="btn btn-edit"
                to={`/editar/${incident.id}`}
                style={{ marginLeft: '10px' }}
              >
                Editar
              </Link>
            </div>
          </div>
        ))}

        {filteredIncidents.length === 0 && (
          <p>No se encontraron incidencias. ¡Crea una nueva!</p>
        )}
      </div>
    </div>
  );
}