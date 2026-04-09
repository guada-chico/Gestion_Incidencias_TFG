import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NUEVO: Estado para el buscador
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts') // Cambia por tu API real
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar los datos');
        return res.json();
      })
      .then(data => {
        setIncidents(data.slice(0, 10));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas borrar esta incidencia?')) {
      setIncidents(incidents.filter(inc => inc.id !== id));
      alert('Incidencia borrada con éxito');
    }
  };

  // NUEVO: Filtrar incidencias antes de mostrarlas
  const filteredIncidents = incidents.filter(incident => 
    incident.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Cargando incidencias...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Listado de Incidencias</h2>
      
      {/* NUEVO: Input buscador */}
      <input 
        type="text" 
        placeholder="Buscar por título..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '20px' }}
      />

      <div className="incident-grid">
        {/* Cambiamos incidents.map por filteredIncidents.map */}
        {filteredIncidents.map(incident => (
          <div key={incident.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <span style={{ background: 'orange', padding: '2px 5px', borderRadius: '4px', fontSize: '12px' }}>
              Pendiente
            </span>
            <h3>{incident.title}</h3>
            <Link to={`/incidencia/${incident.id}`}>Ver detalle</Link>
            <button onClick={() => handleDelete(incident.id)} style={{ marginLeft: '10px', color: 'red' }}>
              Borrar
            </button>
            <Link to={`/editar/${incident.id}`} style={{ marginLeft: '10px' }}>Editar</Link>
          </div>
        ))}
        {/* Mensaje si la búsqueda no encuentra nada */}
        {filteredIncidents.length === 0 && <p>No se encontraron incidencias.</p>}
      </div>
    </div>
  );
}