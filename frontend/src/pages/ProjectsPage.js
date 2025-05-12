import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';
import Layout from '../components/Layout';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginAndFetchData = async () => {
      try {
        const authRes = await axios.get('check-session.php');
        if (!authRes.data.loggedIn) {
          navigate('/login');
          return;
        }

        const [projectsRes, profileRes] = await Promise.all([
          axios.get('get-projects.php'),
          axios.get('get-profile-picture.php')
        ]);

        if (projectsRes.data.success && Array.isArray(projectsRes.data.projects)) {
          // Filtra proyectos inválidos por seguridad
          const validProjects = projectsRes.data.projects.filter(
            (project) => project && project.id && project.name
          );
          setProjects(validProjects);
        }

        setProfilePic(profileRes.data.picture || 'default.png');
      } catch (err) {
        console.error('Error:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndFetchData();
  }, [navigate]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return alert('Nombre requerido');
    try {
      const res = await axios.post('create-project.php', { name: newProjectName });
  
      if (res.data.success && res.data.project) {
        const nuevoProyecto = res.data.project;
  
        if (nuevoProyecto.id && nuevoProyecto.name) {
          setProjects((prevProjects) => [...prevProjects, nuevoProyecto]);
          setNewProjectName('');
        } else {
          console.warn('El proyecto creado no tiene id o name');
        }
      } else {
        alert('Error al crear el proyecto. Revisa el backend.');
      }
    } catch (err) {
      console.error('Error al crear proyecto:', err);
    }
  };
  
  const handleLogout = async () => {
    try {
      const res = await axios.get('logout.php');
      if (res.data.success) {
        alert('Sesión cerrada');
        navigate('/login');
      } else {
        alert('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      alert('Error al cerrar sesión');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <Layout onLogout={handleLogout} profilePic={profilePic}>
      <div className="projects-page">
        <h2>Proyectos</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Nombre del proyecto"
          />
          <button onClick={handleCreateProject}>+</button>
        </div>

        {projects.length === 0 ? (
          <p>No hay proyectos disponibles.</p>
        ) : (
          <ul>
            {projects.map((project) =>
              project && project.id && project.name ? (
                <li
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {project.name}
                </li>
              ) : null
            )}
          </ul>
        )}
      </div>
    </Layout>
  );
}