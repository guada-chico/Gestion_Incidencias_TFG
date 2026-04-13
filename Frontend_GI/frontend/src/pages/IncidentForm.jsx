import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Recibimos 'onAdd' para crear y la lista 'incidents' para cuando toque editar
export default function IncidentForm({ onAdd, incidents = [], setIncidents }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'abierta',
    priority: 'media'
  });

  const [loading, setLoading] = useState(!!id);

  // Si estamos editando, buscamos la incidencia en nuestro estado local
  useEffect(() => {
    if (id && incidents.length > 0) {
      const existingIncident = incidents.find(inc => inc.id === parseInt(id));
      if (existingIncident) {
        setFormData({
          title: existingIncident.title,
          description: existingIncident.description || existingIncident.body,
          status: existingIncident.status,
          priority: existingIncident.priority
        });
      }
      setLoading(false);
    } else if (id) {
      // Si el ID existe pero la lista está vacía (por ejemplo al recargar), 
      // quitamos el loading para poder usar el formulario
      setLoading(false);
    }
  }, [id, incidents]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      // LÓGICA DE EDICIÓN: Actualizamos el registro existente en la lista global
      const updatedIncidents = incidents.map(inc => 
        inc.id === parseInt(id) ? { ...formData, id: parseInt(id) } : inc
      );
      setIncidents(updatedIncidents);
      alert('¡Incidencia editada con éxito!');
    } else {
      // LÓGICA DE CREACIÓN: Generamos un ID y usamos onAdd
      const newIncident = {
        ...formData,
        id: Date.now(), // ID único temporal
      };
      onAdd(newIncident);
      alert('¡Incidencia creada con éxito!');
    }

    navigate('/');
  };

  if (loading) return <p>Cargando datos de la incidencia...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
      <h2>{id ? 'Editar Incidencia' : 'Crear Nueva Incidencia'}</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        {/* TÍTULO */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ padding: '8px' }}
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            style={{ padding: '8px' }}
          />
        </div>

        {/* ESTADO */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="status">Estado:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ padding: '8px' }}
          >
            <option value="abierta">Abierta</option>
            <option value="en proceso">En proceso</option>
            <option value="resuelta">Resuelta</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>

        {/* PRIORIDAD */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="priority">Prioridad:</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={{ padding: '8px' }}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>

        {/* BOTÓN - Mantenemos tu color 'blue' y estilos */}
        <button
          type="submit"
          style={{
            padding: '10px',
            background: 'blue',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {id ? 'Guardar Cambios' : 'Crear Incidencia'}
        </button>
      </form>
    </div>
  );
}