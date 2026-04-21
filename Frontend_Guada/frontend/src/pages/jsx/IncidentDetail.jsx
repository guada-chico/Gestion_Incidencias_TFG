import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquareText, CalendarClock, User2, ArrowLeft, ShieldAlert, Info, Tag, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import { updateIncidencia } from '../../services/incidencias-service';
import '../css/IncidentDetail.css'; 

export default function IncidentDetail({ incidents, setIncidents }) {
  const { id } = useParams();
  const [newComment, setNewComment] = useState('');
  
  const incident = incidents.find(inc => inc.id === parseInt(id));

  // LÓGICA DE PARSEO: Convertimos el String del Back en un Array para el Front
  // Intenta con PascalCase primero (como devuelve el GET), luego camelCase, luego localStorage
  const comentariosJson = incident?.ComentariosJson || incident?.comentariosJson || '';
  const comentariosBackend = comentariosJson ? JSON.parse(comentariosJson) : [];
  
  // Fallback: Si el backend no devuelve comentarios, intentamos recuperarlos de localStorage
  const comentariosLocal = localStorage.getItem(`comentarios_${id}`) ? JSON.parse(localStorage.getItem(`comentarios_${id}`)) : [];
  const listaComentarios = comentariosBackend.length > 0 ? comentariosBackend : comentariosLocal;

  const estadoMap = { 0: 'Abierta', 1: 'En Progreso', 2: 'Resuelta', 3: 'Cerrada' };
  const prioridadMap = { 0: 'Baja', 1: 'Media', 2: 'Alta', 3: 'Crítica' };

  const getStatusLabel = (estado) => estadoMap[estado] || String(estado);
  const getPriorityLabel = (prioridad) => prioridadMap[prioridad] || String(prioridad);
  const getStatusColor = (s) => ({'Abierta': '#3498db', 'En Progreso': '#f39c12', 'Resuelta': '#2ecc71', 'Cerrada': '#646464'}[s] || '#ccc');
  const getPriorityColor = (p) => ({'Baja': '#2ecc71', 'Media': '#f1c40f', 'Alta': '#e67e22', 'Crítica': '#e74c3c'}[p] || '#ccc');

  const formatLimitDate = (dateStr) => {
    if (!dateStr) return 'No definida';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    const nuevoComentarioObj = { text: newComment, date: new Date().toLocaleString('es-ES') };
    const nuevaListaComentarios = [...listaComentarios, nuevoComentarioObj];

    const incidentActualizado = { 
      Id: incident.id,
      Titulo: incident.titulo,
      Descripcion: incident.descripcion,
      Estado: incident.estado,
      Prioridad: incident.prioridad,
      FechaCreacion: incident.fechaCreacion,
      FechaLimite: incident.fechaLimite,
      UsuarioAsignado: incident.usuarioAsignado,
      ComentariosJson: JSON.stringify(nuevaListaComentarios)
    };

    console.log('Enviando datos actualizados:', incidentActualizado);

    try {
      const resultado = await updateIncidencia(incident.id, incidentActualizado);
      console.log('Respuesta del backend:', resultado);
      
      localStorage.setItem(`comentarios_${id}`, JSON.stringify(nuevaListaComentarios));

      const updated = incidents.map(inc => 
        inc.id === incident.id ? { 
          ...inc, 
          comments: nuevaListaComentarios, 
          ComentariosJson: JSON.stringify(nuevaListaComentarios),
          comentariosJson: JSON.stringify(nuevaListaComentarios)
        } : inc
      );
      setIncidents(updated);
      setNewComment('');
      
      Swal.fire({
        icon: 'success',
        title: 'Comentario guardado',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo guardar el comentario',
        confirmButtonColor: 'var(--kyocera-red)'
      });
    }
  };

  if (!incident) return <p className="error-msg">Incidencia no encontrada.</p>;

  return (
    <div className="detail-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem' }}>Detalle Incidencias</h2>
      <div className="detail-card">
        <div className="detail-header">
          <h2>{incident.titulo}</h2>
          <div className="limit-date">
            <ShieldAlert size={16} /> Límite: {formatLimitDate(incident.fechaLimite)}
          </div>
        </div>

        <div className="tags-row">
          <div className="tag-item">
            <Info size={16} color={getStatusColor(getStatusLabel(incident.estado))} />
            <strong>Estado:</strong> 
            <span style={{ color: getStatusColor(getStatusLabel(incident.estado)) }}>{getStatusLabel(incident.estado).toUpperCase()}</span>
          </div>
          <div className="tag-item">
            <Tag size={16} color={getPriorityColor(getPriorityLabel(incident.prioridad))} />
            <strong>Prioridad:</strong> 
            <span style={{ color: getPriorityColor(getPriorityLabel(incident.prioridad)) }}>{getPriorityLabel(incident.prioridad).toUpperCase()}</span>
          </div>
        </div>

        <div className="description-section" style={{ marginTop: '30px', marginBottom: '25px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', color: '#333', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
            <FileText size={16} color='#d477fb' />Descripción Incidencia
          </h3>
          <p className="description-text" style={{ background: '#f9f9f9', padding: '18px', borderRadius: '10px', border: '1px solid #eee', lineHeight: '1.6', color: '#444' }}>
            {incident.descripcion}
          </p>
        </div>
        
        <div className="assigned-user" style={{ marginBottom: '20px' }}>
          <User2 size={16} color='#6582f7' /> <strong>Usuario asignado:</strong> {incident.usuarioAsignado || 'Pendiente'}
        </div>

        <div className="dates-grid">
          <div className="date-item">
            <CalendarClock size={16} /> <strong>Creada:</strong> {new Date(incident.fechaCreacion).toLocaleDateString('es-ES')}
          </div>
        </div>
        
        <h4 className="comments-title">
          <MessageSquareText size={16} color="var(--kyocera-red)" /> Seguimiento
        </h4>

        <div className="comments-history">
          {listaComentarios.length > 0 ? (
            listaComentarios.map((c, i) => (
              <div key={i} className="comment-block">
                <div className="comment-date">{c.date}</div>
                <div className="comment-text">{c.text}</div>
              </div>
            ))
          ) : (
            <p className="no-comments">No hay comentarios aún.</p>
          )}
        </div>

        <div className="comment-input-row">
          <input 
            className="search-input" 
            style={{ flex: 1, marginBottom: 0 }} 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            placeholder="Añadir nota..." 
          />
          <button onClick={addComment} className="btn-search" style={{ width: 'auto' }}>Enviar</button>
        </div>
      </div>

      <div className="back-link-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> Volver al listado
        </Link>
      </div>
    </div>
  );
}