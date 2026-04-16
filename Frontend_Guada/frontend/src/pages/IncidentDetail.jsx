import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquareText, CalendarClock, History, User2, ArrowLeft, ShieldAlert, Info, Tag, FileText } from 'lucide-react';
import './IncidentDetail.css'; 

export default function IncidentDetail({ incidents, setIncidents }) {
  const { id } = useParams();
  const [newComment, setNewComment] = useState('');
  const incident = incidents.find(inc => inc.id === parseInt(id));

  const getStatusColor = (s) => ({'abierta': '#3498db', 'en proceso': '#f39c12', 'resuelta': '#2ecc71', 'cerrada': '#646464'}[s] || '#ccc');
  const getPriorityColor = (p) => ({'baja': '#2ecc71', 'media': '#f1c40f', 'alta': '#e67e22', 'critica': '#e74c3c'}[p] || '#ccc');

  const formatLimitDate = (dateStr) => {
    if (!dateStr) return 'No definida';
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const updated = incidents.map(inc => 
      inc.id === incident.id ? { ...inc, comments: [...(inc.comments || []), { text: newComment, date: new Date().toLocaleString() }] } : inc
    );
    setIncidents(updated);
    setNewComment('');
  };

  if (!incident) return <p className="error-msg">Incidencia no encontrada.</p>;

  return (
    <div className="detail-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem' }}>Detalle Incidencias</h2>
      <div className="detail-card">
        
        {/* TÍTULO PRINCIPAL */}
        <div className="detail-header">
          <h2>{incident.title}</h2>
          <div className="limit-date">
            <ShieldAlert size={16} /> Límite: {formatLimitDate(incident.FechaLimite)}
          </div>
        </div>

        {/* ETIQUETAS RÁPIDAS */}
        <div className="tags-row">
          <div className="tag-item">
            <Info size={16} color={getStatusColor(incident.status)} />
            <strong>Estado:</strong> 
            <span style={{ color: getStatusColor(incident.status) }}>{incident.status.toUpperCase()}</span>
          </div>
          <div className="tag-item">
            <Tag size={16} color={getPriorityColor(incident.priority)} />
            <strong>Prioridad:</strong> 
            <span style={{ color: getPriorityColor(incident.priority) }}>{incident.priority.toUpperCase()}</span>
          </div>
        </div>

        {/* --- SECCIÓN DESCRIPCIÓN (COMO TÍTULO ARRIBA DEL CUADRO) --- */}
        <div className="description-section" style={{ marginTop: '30px', marginBottom: '25px' }}>
          <h3 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            fontSize: '20px', 
            color: '#333',
            marginBottom: '15px',
            borderBottom: '2px solid #eee',
            paddingBottom: '8px'
          }}>
            <FileText size={20} color='#d477fb' /><strong> Descripción Incidencia</strong>
          </h3>
          <p className="description-text" style={{ 
            background: '#f9f9f9', 
            padding: '18px', 
            borderRadius: '10px', 
            border: '1px solid #eee',
            lineHeight: '1.6',
            color: '#444'
          }}>
            {incident.description}
          </p>
        </div>
        
        <div className="assigned-user" style={{ marginBottom: '20px' }}>
          <User2 size={20} color='#6582f7' /> <strong>Usuario asignado:</strong> {incident.assignedUser || 'Pendiente'}
        </div>

        <div className="dates-grid">
          <div className="date-item">
            <CalendarClock size={20} /> <strong>Creada:</strong> {incident.FechaCreacion}
          </div>
          <div className="date-item">
            <History size={20} /> <strong>Actualizada:</strong> {incident.FechaActualizacion}
          </div>
        </div>

        <hr className="detail-hr" />
        
        <h4 className="comments-title">
          <MessageSquareText size={20} color="var(--kyocera-red)" /> Seguimiento
        </h4>

        <div className="comments-history">
          {incident.comments?.length > 0 ? (
            incident.comments.map((c, i) => (
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