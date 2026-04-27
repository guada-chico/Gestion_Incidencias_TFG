import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ClipboardList, User, Calendar, Tag, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import { API_BASE_URL, authHeader } from '../../services/api-config';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de tenerlo instalado
import '../css/IncidentForm.css';
import tituloNueva from '../../assets/NUEVA_sf.png';
import tituloEditar from '../../assets/EDITAR_sf.png';

export default function IncidentForm({ incidents = [], setIncidents, onAdd }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    Id: 0,
    Titulo: '', 
    Descripcion: '', 
    Estado: 0,
    Prioridad: 0,
    UsuarioAsignado: '', 
    FechaLimite: '' 
  });

  const MAX_TITLE_LENGTH = 80;

  // --- NUEVA LÓGICA DE DETECCIÓN DE ROL ---
  const token = localStorage.getItem('token');
  let userRole = 'User';
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // Buscamos el rol en el formato largo de .NET y en el corto
      userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role || 'User';
    } catch (e) { console.error("Error al leer token", e); }
  }
  const isAdmin = userRole === 'Admin';
  // ---------------------------------------

  useEffect(() => {
    if (id) {
      const existing = incidents.find(inc => inc.id === parseInt(id));
      if (existing) {
        setFormData({
          Titulo: existing.titulo || '',
          Descripcion: existing.descripcion || '',
          Estado: existing.estado || 0,
          Prioridad: existing.prioridad || 0,
          UsuarioAsignado: existing.usuarioAsignado || '',
          FechaLimite: existing.fechaLimite ? existing.fechaLimite.split('T')[0] : '',
          Id: existing.id
        });
      }
    }
  }, [id, incidents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (Tu lógica de validación se mantiene igual)
    const incidentToSend = {
      Titulo: formData.Titulo.trim(),
      Descripcion: formData.Descripcion.trim(),
      Estado: parseInt(formData.Estado),
      Prioridad: parseInt(formData.Prioridad),
      UsuarioAsignado: formData.UsuarioAsignado?.trim() || null,
      FechaLimite: formData.FechaLimite || null,
      Id: formData.Id || 0
    };

    try {
      const url = id ? `${API_BASE_URL}/incidencias/${id}` : `${API_BASE_URL}/incidencias`;
      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(incidentToSend)
      });
      if (!response.ok) throw new Error('Fallo al guardar');
      if (typeof onAdd === 'function') await onAdd();
      Swal.fire({ icon: 'success', title: id ? 'Actualizado' : '¡Creada!', confirmButtonColor: 'var(--fixora-red)' })
        .then(() => navigate('/'));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message, confirmButtonColor: 'var(--fixora-red)' });
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <img src={id ? tituloEditar : tituloNueva} alt="Título" className="titulo-img" />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label"><ClipboardList size={18} color='#d477fb'/> Título</label>
              <span className="char-counter" style={{ color: formData.Titulo.length >= MAX_TITLE_LENGTH ? 'red' : '#999' }}>
                {formData.Titulo.length} / {MAX_TITLE_LENGTH}
              </span>
            </div>
            <input className="search-input" type="text" value={formData.Titulo} onChange={(e) => setFormData({...formData, Titulo: e.target.value})} required maxLength={MAX_TITLE_LENGTH} />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción Detallada</label>
            <textarea className="search-input form-textarea" value={formData.Descripcion} onChange={(e) => setFormData({...formData, Descripcion: e.target.value})} required rows="4" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><User size={18} color='#6582f7'/> Asignar a</label>
              {/* CAMBIO: Si es Admin puede escribir, si no, solo lectura */}
              <input 
                className="search-input" 
                type="text" 
                value={formData.UsuarioAsignado} 
                onChange={(e) => setFormData({...formData, UsuarioAsignado: e.target.value})} 
                readOnly={!isAdmin}
                style={!isAdmin ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label"><Calendar size={18} color='var(--fixora-red)'/> Fecha Límite</label>
              <input className="search-input" type="date" value={formData.FechaLimite} onChange={(e) => setFormData({...formData, FechaLimite: e.target.value})} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><Tag size={18} color='var(--fixora-red)'/>Estado</label>
              <select className="search-input" value={formData.Estado} onChange={(e) => setFormData({...formData, Estado: e.target.value})}>
                <option value={0}>Abierta</option>
                <option value={1}>En Progreso</option>
                <option value={2}>Resuelta</option>
                <option value={3}>Cerrada</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label"><Info size={18} color='var(--fixora-red)'/> Prioridad</label>
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