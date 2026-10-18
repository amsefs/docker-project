import { useState, useEffect } from 'react';

function App() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para formularios
  const [nuevaFormacion, setNuevaFormacion] = useState({ titulo: '', institucion: '', anio: '' });
  const [editPersona, setEditPersona] = useState(false);
  const [datosPersona, setDatosPersona] = useState({ nombre: '', apellido: '', ciudad: '', foto: '' });

  const fetchData = () => {
    fetch('http://localhost:4000/cv')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar los datos');
        return res.json();
      })
      .then((data) => {
        setCvData(data);
        setDatosPersona(data.datos_personales);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFormacion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/formacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaFormacion)
      });
      if (res.ok) {
        setNuevaFormacion({ titulo: '', institucion: '', anio: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePersona = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/persona', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosPersona)
      });
      if (res.ok) {
        setEditPersona(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Cargando CV...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!cvData) return null;

  const { datos_personales, formacion_academica } = cvData;

  return (
    <div className="container">
      <header className="header">
        <div className="profile-img-container">
          <img 
            src={datos_personales.foto} 
            alt={`${datos_personales.nombre} ${datos_personales.apellido}`} 
            className="profile-img"
          />
        </div>
        <div className="header-info">
          {!editPersona ? (
            <>
              <h1>{datos_personales.nombre} {datos_personales.apellido}</h1>
              <p className="location">📍 {datos_personales.ciudad}</p>
              <button className="btn-edit" onClick={() => setEditPersona(true)}>✏️ Editar Datos</button>
            </>
          ) : (
            <form className="form-edit" onSubmit={handleUpdatePersona}>
              <input type="text" placeholder="Nombre" value={datosPersona.nombre} onChange={e => setDatosPersona({...datosPersona, nombre: e.target.value})} required />
              <input type="text" placeholder="Apellido" value={datosPersona.apellido} onChange={e => setDatosPersona({...datosPersona, apellido: e.target.value})} required />
              <input type="text" placeholder="Ciudad" value={datosPersona.ciudad} onChange={e => setDatosPersona({...datosPersona, ciudad: e.target.value})} required />
              <input type="url" placeholder="URL Foto" value={datosPersona.foto} onChange={e => setDatosPersona({...datosPersona, foto: e.target.value})} required />
              <div className="form-actions">
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" className="btn-cancel" onClick={() => setEditPersona(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </header>

      <main className="main-content">
        <section className="education-section">
          <h2>Formación Académica</h2>
          <div className="timeline">
            {formacion_academica.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>{item.titulo}</h3>
                  <h4>{item.institucion}</h4>
                  <span className="year">{item.anio}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="add-formacion">
            <h3>Añadir Nueva Formación</h3>
            <form onSubmit={handleAddFormacion} className="form-add">
              <input type="text" placeholder="Título (Ej. Ingeniería...)" value={nuevaFormacion.titulo} onChange={e => setNuevaFormacion({...nuevaFormacion, titulo: e.target.value})} required />
              <input type="text" placeholder="Institución" value={nuevaFormacion.institucion} onChange={e => setNuevaFormacion({...nuevaFormacion, institucion: e.target.value})} required />
              <input type="text" placeholder="Año (Ej. 2020-2024)" value={nuevaFormacion.anio} onChange={e => setNuevaFormacion({...nuevaFormacion, anio: e.target.value})} required />
              <button type="submit" className="btn-add">➕ Agregar</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
