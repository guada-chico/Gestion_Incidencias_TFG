import { useParams, Link } from 'react-router-dom';

// Recibimos la lista de incidencias real como prop desde App.jsx
export default function IncidentDetail({ incidents }) {
  const { id } = useParams();

  // Buscamos la incidencia en nuestra lista local usando el ID de la URL
  const incident = incidents.find(inc => inc.id === parseInt(id));

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

  // Si aún no hay datos o no se encuentra la incidencia
  if (!incident) return <p style={{ padding: '20px' }}>No se encontró la incidencia o no hay datos disponibles.</p>;

  return (
    <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Detalle de la Incidencia #{incident.id}</h2>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '8px'
        }}
      >
        <h3>{incident.title}</h3>

        <p><strong>Descripción:</strong></p>
        <p>{incident.description || incident.body}</p>

        {/* BADGES - Ahora muestran el estado y prioridad real que elegiste en el formulario */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <span
            style={{
              background: getStatusColor(incident.status),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '5px',
              fontSize: '12px'
            }}
          >
            {incident.status}
          </span>

          <span
            style={{
              background: getPriorityColor(incident.priority),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '5px',
              fontSize: '12px'
            }}
          >
            {incident.priority}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>
          ⬅ Volver al listado
        </Link>

        <Link to={`/editar/${incident.id}`}>
          ✏️ Editar
        </Link>
      </div>
    </div>
  );
}