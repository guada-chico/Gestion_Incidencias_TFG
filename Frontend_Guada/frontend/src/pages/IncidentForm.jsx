import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ClipboardList, User, Calendar, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { API_BASE_URL, authHeader } from '../services/api-config'; // Importante para la conexión
import './IncidentForm.css';

export default function IncidentForm({ incidents = [], setIncidents }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // CORRECCIÓN: Nombres en PascalCase para coincidir con ModelsIncidencia.cs
  const [formData, setFormData] = useState({ 
    Titulo: '', 
    Descripcion: '', 
    Estado: 0, // 0 = Abierta (según Estado.cs)
    Prioridad: 0, // 0 = Baja (según Prioridad.cs)
    UsuarioAsignado: '', 
    FechaLimite: '' 
  });

  const MAX_TITLE_LENGTH = 80;

  // Mapeo de Enums para el formulario (Texto -> Número)
  const estadoMap = { "Abierta": 0, "EnProgreso": 1, "Resuelta": 2, "Cerrada": 3 };
  const prioridadMap = { "Baja": 0, "Media": 1, "Alta": 2, "Crítica": 3 };

  useEffect(() => {
    if (id) {
      // CORRECCIÓN: Buscar por 'Id' en mayúscula
      const existing = incidents.find(inc => inc.Id === parseInt(id));
      if (existing) {
        setFormData({
          ...existing,
          // Aseguramos que la fecha tenga el formato correcto para el input date
          FechaLimite: existing.FechaLimite ? existing.FechaLimite.split('T')[0] : ''
        });
      }
    }
  }, [id, incidents]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparamos el objeto EXACTO que espera el Backend
    const incidentToSend = {
      ...formData,
      Id: id ? parseInt(id) : 0,
      Estado: parseInt(formData.Estado),
      Prioridad: parseInt(formData.Prioridad)
    };

    try {
      const url = id 
        ? `${API_BASE_URL}/incidencias/${id}` 
        : `${API_BASE_URL}/incidencias`;
      
      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeader() // Enviamos el Token JWT
        },
        body: JSON.stringify(incidentToSend)
      });

      if (!response.ok) throw new Error('Error al guardar la incidencia');

      Swal.fire({ 
        icon: 'success', 
        title: id ? 'Actualizado' : '¡Creada!', 
        confirmButtonColor: 'var(--kyocera-red)' 
      }).then(() => navigate('/incidents'));

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">{id ? 'Editar Incidencia' : 'Nueva Incidencia'}</h2>

        <form onSubmit={handleSubmit}>
          {/* TÍTULO */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label"><ClipboardList size={18} color='#d477fb'/> Título</label>
              <span className="char-counter" style={{ color: formData.Titulo.length >= MAX_TITLE_LENGTH ? 'red' : '#999' }}>
                {formData.Titulo.length} / {MAX_TITLE_LENGTH}
              </span>
            </div>
            <input 
              className="search-input" 
              type="text" 
              value={formData.Titulo} 
              onChange={(e) => setFormData({...formData, Titulo: e.target.value})} 
              required 
              maxLength={MAX_TITLE_LENGTH} 
              placeholder="Resumen de la incidencia..."
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="form-group">
            <label className="form-label">Descripción Detallada</label>
            <textarea 
              className="search-input form-textarea" 
              value={formData.Descripcion} 
              onChange={(e) => setFormData({...formData, Descripcion: e.target.value})} 
              required 
              rows="4" 
              placeholder="Escribe aquí todos los detalles..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><User size={18} color='#6582f7'/> Asignar a</label>
              <input 
                className="search-input" 
                type="text" 
                placeholder="Usuario responsable"
                value={formData.UsuarioAsignado} 
                onChange={(e) => setFormData({...formData, UsuarioAsignado: e.target.value})} 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label"><Calendar size={18} color='var(--kyocera-red)'/> Fecha Límite</label>
              <input 
                className="search-input" 
                type="date" 
                value={formData.FechaLimite} 
                onChange={(e) => setFormData({...formData, FechaLimite: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="search-input" value={formData.Estado} onChange={(e) => setFormData({...formData, Estado: e.target.value})}>
                <option value={0}>Abierta</option>
                <option value={1}>En proceso</option>
                <option value={2}>Resuelta</option>
                <option value={3}>Cerrada</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label"><AlertCircle size={18} color='var(--kyocera-red)'/> Prioridad</label>
              <select className="search-input" value={formData.Prioridad} onChange={(e) => setFormData({...formData, Prioridad: e.target.value})}>
                <option value={0}>Baja</option>
                <option value={1}>Media</option>
                <option value={2}>Alta</option>
                <option value={3}>Crítica</option>
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