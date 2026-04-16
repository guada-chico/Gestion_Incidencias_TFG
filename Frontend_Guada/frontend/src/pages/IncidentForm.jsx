import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ClipboardList, User, Calendar, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import './IncidentForm.css'; // Importante importar el CSS

export default function IncidentForm({ onAdd, incidents = [], setIncidents }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    status: 'Abierta', 
    priority: 'Media', 
    assignedUser: '', 
    FechaLimite: '' 
  });

  const MAX_TITLE_LENGTH = 80;

  useEffect(() => {
    if (id) {
      const existing = incidents.find(inc => inc.id === parseInt(id));
      if (existing) setFormData(existing);
    }
  }, [id, incidents]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date().toLocaleString();

    if (id) {
      setIncidents(incidents.map(inc => inc.id === parseInt(id) ? { ...formData, FechaActualizacion: now } : inc));
      Swal.fire({ icon: 'success', title: 'Actualizado', confirmButtonColor: 'var(--kyocera-red)' }).then(() => navigate('/'));
    } else {
      onAdd({ ...formData, id: Date.now(), FechaCreacion: now, FechaActualizacion: now, comments: [] });
      Swal.fire({ icon: 'success', title: '¡Creada!', confirmButtonColor: 'var(--kyocera-red)' }).then(() => navigate('/'));
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        
        <h2 className="form-title">
          {id ? 'Editar Incidencia' : 'Nueva Incidencia'}
        </h2>

        <form onSubmit={handleSubmit}>
          
          {/* TÍTULO (Solo creación) */}
          {!id && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label"><ClipboardList size={18} color='#d477fb'/> Título</label>
                <span className="char-counter" style={{ color: formData.title.length >= MAX_TITLE_LENGTH ? 'red' : '#999' }}>
                  {formData.title.length} / {MAX_TITLE_LENGTH}
                </span>
              </div>
              <input 
                className="search-input" 
                type="text" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
                maxLength={MAX_TITLE_LENGTH} 
                placeholder="Resumen de la incidencia..."
              />
            </div>
          )}

          {/* DESCRIPCIÓN */}
          <div className="form-group">
            <label className="form-label">Descripción Detallada</label>
            <textarea 
              className="search-input form-textarea" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              required 
              rows="4" 
              placeholder="Escribe aquí todos los detalles..."
            />
          </div>

          {/* FILA: USUARIO Y FECHA */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><User size={18} color='#6582f7'/> Asignar a</label>
              <input 
                className="search-input" 
                type="text" 
                placeholder="Usuario responsable"
                value={formData.assignedUser} 
                onChange={(e) => setFormData({...formData, assignedUser: e.target.value})} 
              />
            </div>
            
            {!id && (
              <div className="form-group">
                <label className="form-label"><Calendar size={18} color='var(--kyocera-red)'/> Fecha Límite</label>
                <input 
                  className="search-input" 
                  type="date" 
                  value={formData.FechaLimite} 
                  onChange={(e) => setFormData({...formData, FechaLimite: e.target.value})} 
                  required 
                />
              </div>
            )}
          </div>

          {/* FILA: ESTADO Y PRIORIDAD */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="search-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Abierta">Abierta</option>
                <option value="EnProceso">En proceso</option>
                <option value="Resuelta">Resuelta</option>
                <option value="Cerrada">Cerrada</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label"><AlertCircle size={18} color='var(--kyocera-red)'/> Prioridad</label>
              <select className="search-input" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-search btn-submit-full">
            <Save size={20}/> {id ? 'Guardar Cambios' : 'Registrar Incidencia'}
          </button>
        </form>
      </div>
    </div>
  );
}