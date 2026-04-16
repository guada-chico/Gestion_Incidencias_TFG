import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquareText, CalendarClock, User2, ArrowLeft, ShieldAlert, Info, Tag, FileText } from 'lucide-react';
import { updateIncidencia } from '../services/incidencias-service'; // Importamos el servicio para guardar
import './IncidentDetail.css'; 

export default function IncidentDetail({ incidents, setIncidents }) {
  const { id } = useParams();
  const [newComment, setNewComment] = useState('');
  
  // 1. Buscamos la incidencia
  const incident = incidents.find(inc => inc.Id === parseInt(id));

  // 2. LÓGICA DE PARSEO: Convertimos el String del Back en un Array para el Front
  // Si ya existe 'comments' como array lo usamos, si no, intentamos parsear 'ComentariosJson'
  const listaComentarios = incident?.comments || (incident?.ComentariosJson ? JSON.parse(incident.ComentariosJson) : []);

  const estadoMap = { 0: 'Abierta', 1: 'EnProgreso', 2: 'Resuelta', 3: 'Cerrada' };
  const prioridadMap = { 0: 'Baja', 1: 'Media', 2: 'Alta', 3: 'Crítica' };

  const getStatusLabel = (estado) => estadoMap[estado] || String(estado);
  const getPriorityLabel = (prioridad) => prioridadMap[prioridad] || String(prioridad);
  const getStatusColor = (s) => ({'Abierta': '#3498db', 'EnProgreso': '#f39c12', 'Resuelta': '#2ecc71', 'Cerrada': '#646464'}[s] || '#ccc');
  const getPriorityColor = (p) => ({'Baja': '#2ecc71', 'Media': '#f1c40f', 'Alta': '#e67e22', 'Crítica': '#e74c3c'}[p] || '#ccc');

  const formatLimitDate = (dateStr) => {
    if (!dateStr) return 'No definida';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  // 3. FUNCIÓN CORREGIDA PARA GUARDAR
  const addComment = async () => {
    if (!newComment.trim()) return;

    const nuevoComentarioObj = { text: newComment, date: new Date().toLocaleString('es-ES') };
    const nuevaListaComentarios = [...listaComentarios, nuevoComentarioObj];

    // Preparamos el objeto para el Backend (con el JSON serializado)
    const incidentActualizado = { 
      ...incident, 
      ComentariosJson: JSON.stringify(nuevaListaComentarios) // Lo enviamos como texto al Back
    };

    try {
      await updateIncidencia(incident.Id, incidentActualizado);
      
      // Actualizamos el estado global para que se vea al instante
      const updated = incidents.map(inc => 
        inc.Id === incident.Id ? { ...inc, comments: nuevaListaComentarios, ComentariosJson: incidentActualizado.ComentariosJson } : inc
      );
      setIncidents(updated);
      setNewComment('');
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  if (!incident) return <p className="error-msg">Incidencia no encontrada.</p>;

  return (
    <div className="detail-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem' }}>Detalle Incidencias</h2>
      <div className="detail-card">
        <div className="detail-header">
          <h2>{incident.Titulo}</h2>
          <div className="limit-date">
            <ShieldAlert size={16} /> Límite: {formatLimitDate(incident.FechaLimite)}
          </div>
        </div>

        <div className="tags-row">
          <div className="tag-item">
            <Info size={16} color={getStatusColor(getStatusLabel(incident.Estado))} />
            <strong>Estado:</strong> 
            <span style={{ color: getStatusColor(getStatusLabel(incident.Estado)) }}>{getStatusLabel(incident.Estado).toUpperCase()}</span>
          </div>
          <div className="tag-item">
            <Tag size={16} color={getPriorityColor(getPriorityLabel(incident.Prioridad))} />
            <strong>Prioridad:</strong> 
            <span style={{ color: getPriorityColor(getPriorityLabel(incident.Prioridad)) }}>{getPriorityLabel(incident.Prioridad).toUpperCase()}</span>
          </div>
        </div>

        <div className="description-section" style={{ marginTop: '30px', marginBottom: '25px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
            <FileText size={20} color='#d477fb' /><strong> Descripción Incidencia</strong>
          </h3>
          <p className="description-text" style={{ background: '#f9f9f9', padding: '18px', borderRadius: '10px', border: '1px solid #eee', lineHeight: '1.6', color: '#444' }}>
            {incident.Descripcion}
          </p>
        </div>
        
        <div className="assigned-user" style={{ marginBottom: '20px' }}>
          <User2 size={20} color='#6582f7' /> <strong>Usuario asignado:</strong> {incident.UsuarioAsignado || 'Pendiente'}
        </div>

        <div className="dates-grid">
          <div className="date-item">
            <CalendarClock size={20} /> <strong>Creada:</strong> {new Date(incident.FechaCreacion).toLocaleDateString('es-ES')}
          </div>
        </div>

        <hr className="detail-hr" />
        
        <h4 className="comments-title">
          <MessageSquareText size={20} color="var(--kyocera-red)" /> Seguimiento
        </h4>

        <div className="comments-history">
          {/* USAMOS LA VARIABLE listaComentarios QUE YA ESTÁ PARSEADA */}
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