// src/components/Sidebar.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ isOpen, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    fetch('http://localhost/myapp/backend/api/get_projects.php')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error cargando proyectos:', err));
  };

  const toggleProjects = () => {
    setShowProjects(!showProjects);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    fetch('http://localhost/myapp/backend/create-project.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newProjectName }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNewProjectName('');
          setShowPopup(false);
          loadProjects();
        }
      })
      .catch(err => console.error('Error al crear proyecto:', err));
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{ marginTop: '60px' }}>
      <div className='section-menu'>
        <ul>
          <li>
            <div style={{ backgroundColor: '#B6B1B1', padding: '6px 8px 7px 8px', borderRadius: '60px', marginRight: '10px' }}>
              <i className='fas fa-home'></i>
            </div>
            <Link to="/dashboard">Inicio</Link>
          </li>
          <li>
            <div style={{ backgroundColor: '#B6B1B1', padding: '6px 10px 8px 10px', borderRadius: '60px', marginRight: '10px' }}>
              <i className='fas fa-user'></i>
            </div>
            <Link to="#">Mis Tareas</Link>
          </li>
        </ul>
      </div>

      <div className='section-menu'>
        <ul>
          <li
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '#333 1px solid',
              margin: '6px 10px 0px 10px',
              borderRadius: showProjects ? '30px 30px 0px 0px' : '30px',
              padding: '7px 10px',
              transition: 'border-radius 0.3s ease'
            }}
          >
            <span onClick={toggleProjects} style={{ cursor: 'pointer' }}>Proyectos</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowPopup(true)} style={{ fontSize: '10px', padding: '5px 7px', backgroundColor: '#B6B1B1', color: '#333', marginBottom: '0px'}}>+</button>
              <button onClick={toggleProjects} style={{ fontSize: '10px', padding: '5px', backgroundColor: '#B6B1B1', color: '#333', marginBottom: '0px'}}>
                {showProjects ? '–' : '▼'}
              </button>
            </div>
          </li>

          {showProjects && (
            <ul style={{ margin: '0px 10px 10px 10px', backgroundColor: '#B6B1B1', borderRadius: '0px 0px 30px 30px' }}>
              {projects.map(project => (
                <li key={project.id}>
                  <Link to={`/project/${project.id}`}>{project.name}</Link>
                </li>
              ))}
            </ul>
          )}

          <li>
            <button onClick={onLogout} className="logout-button">Cerrar sesión</button>
          </li>
        </ul>
      </div>

      {showPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '8px', minWidth: '300px',
            display: 'flex', flexDirection: 'column', gap: '10px'
          }}>
            <h3>Nuevo Proyecto</h3>
            <input
              type="text"
              placeholder="Nombre del proyecto"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowPopup(false)}>Cancelar</button>
              <button onClick={handleCreateProject}>Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}