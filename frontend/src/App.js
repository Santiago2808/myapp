import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from './config/axiosConfig';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ProjectDashboard from './pages/ProjectDashboard';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TaskPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get('check-session.php');
        if (res.data.loggedIn) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error comprobando sesión', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);
  

  const handleLogout = async () => {
    try {
      await axios.get('logout.php');
      setUser(null); // Limpiar usuario
      navigate('/'); // Redirigir al home
    } catch (error) {
      console.error('Error cerrando sesión', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/login" element={<Login onLogin={setUser} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/project/:projectId" element={<ProjectDashboard />} />
      <Route path="/my-tasks" element={<TasksPage />} />
    </Routes>
  );
}

export default App;
