import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../config/axiosConfig';
import Select from 'react-select';
import Layout from '../components/Layout';

export default function ProjectDashboard({ profilePic }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', due_date: '', assigned_to: [] });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [assignedUsersForEditing, setAssignedUsersForEditing] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [selectedUserToAdd, setSelectedUserToAdd] = useState(null);
  const [loading, setLoading] = useState(true); // ⚠️ NUEVO

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('check-session.php', { withCredentials: true });
        if (res.data.loggedIn) {
          setUser(res.data.user);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!user) return;

      setLoading(true); // ⚠️ NUEVO: Evita mostrar datos incorrectos

      try {
        const [tasksRes, usersRes, projectRes] = await Promise.all([
          axios.get(`get-tasks.php?project_id=${projectId}`),
          axios.get('get-users.php'),
          axios.get(`get-projects.php?project_id=${projectId}`)
        ]);

        if (tasksRes.data.success) setTasks(tasksRes.data.tasks || []);
        if (usersRes.data.success) setUsers(usersRes.data.users || []);
        if (projectRes.data.success) {
          setProjectName(projectRes.data.project.name);
        } else {
          setProjectName('Proyecto no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener datos del proyecto:', error);
        setProjectName('Error');
      } finally {
        setLoading(false); // ⚠️ NUEVO
      }
    };

    // Limpiar estados anteriores al cambiar de proyecto
    setTasks([]);
    setProjectName('');
    setNewTask({ name: '', due_date: '', assigned_to: [] });
    setEditingTaskId(null);
    setAssignedUsersForEditing([]);
    setSelectedUserToAdd(null);

    fetchProjectData();
  }, [user, projectId]);

  const handleCreateTask = async () => {
    try {
      const res = await axios.post('create-task.php', {
        title: newTask.name,
        due_date: newTask.due_date,
        project_id: projectId,
        assigned_to: newTask.assigned_to
      });

      if (res.data.success) {
        const updated = await axios.get(`get-tasks.php?project_id=${projectId}`);
        setTasks(updated.data.tasks);
        setNewTask({ name: '', due_date: '', assigned_to: [] });
      }
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  const toggleComplete = async (taskId, currentStatus) => {
    try {
      await axios.post('update-task-status.php', {
        task_id: taskId,
        completed: currentStatus ? 0 : 1
      });

      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, completed: !currentStatus } : t
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleEditUsersForTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const assigned = (task?.assigned_users || []).map(u => u.id);
    setAssignedUsersForEditing(assigned);
    setEditingTaskId(taskId);
    setSelectedUserToAdd(null);
  };

  const handleSaveEditedUsers = async () => {
    try {
      await axios.post('update-task-users.php', {
        task_id: editingTaskId,
        assigned_to: assignedUsersForEditing
      });

      const updated = await axios.get(`get-tasks.php?project_id=${projectId}`);
      setTasks(updated.data.tasks);
      setEditingTaskId(null);
      setAssignedUsersForEditing([]);
      setSelectedUserToAdd(null);
    } catch (error) {
      console.error("Error al guardar usuarios:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get('logout.php');
      if (res.data.success) {
        localStorage.removeItem('user');
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

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`,
    userData: user
  }));

  return (
    <Layout onLogout={handleLogout} profilePic={profilePic}>
      <div className="project-dashboard">
        <h2>Tareas del Proyecto {projectName && <span style={{ color: '#007bff' }}>– {projectName}</span>}</h2>

        {loading ? (
          <p>Cargando datos del proyecto...</p>
        ) : (
          <>
            {/* Crear tarea */}
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Nombre de la tarea"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              />
              <div style={{ marginTop: 10, marginBottom: 10 }}>
                <Select
                  isMulti
                  options={userOptions}
                  onChange={(selected) =>
                    setNewTask({ ...newTask, assigned_to: selected.map(opt => opt.value) })
                  }
                  placeholder="Asignar usuarios..."
                  formatOptionLabel={(option) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img
                        src={`http://localhost/myapp/backend/uploads/${option.userData.profile_picture || 'default.png'}`}
                        alt={option.userData.name}
                        style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span>{option.userData.name} ({option.userData.email})</span>
                    </div>
                  )}
                />
              </div>
              <button onClick={handleCreateTask}>Crear tarea</button>
            </div>

            {/* Lista de tareas */}
            <table style={{ width: '100%', textAlign: 'center' }}>
              <thead>
                <tr>
                  <th>Completada</th>
                  <th>Nombre</th>
                  <th>Fecha de entrega</th>
                  <th>Asignado a</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} style={{ backgroundColor: task.completed ? '#d4edda' : '#f8d7da' }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id, task.completed)}
                      />
                    </td>
                    <td>{task.name}</td>
                    <td>{task.due_date}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(task.assigned_users || []).map(user => (
                          user?.id && (
                            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <img
                                src={`http://localhost/myapp/backend/uploads/${user.profile_picture || 'default.png'}`}
                                alt={user.name}
                                style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <span>{user.name}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </td>
                    <td>
                      <button onClick={() => handleEditUsersForTask(task.id)}>Editar asignados</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Popup edición usuarios */}
            {editingTaskId && (
              <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                justifyContent: 'center', alignItems: 'center', zIndex: 9999
              }}>
                <div style={{
                  backgroundColor: 'white', padding: 20, borderRadius: 8,
                  maxWidth: 600, width: '100%'
                }}>
                  <h3>Editar usuarios asignados</h3>
                  <ul style={{ marginBottom: 10 }}>
                    {assignedUsersForEditing.map((userId) => {
                      const user = users.find(u => u.id === userId);
                      return user ? (
                        <li key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img
                            src={`http://localhost/myapp/backend/uploads/${user.profile_picture || 'default.png'}`}
                            alt={user.name}
                            style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span>{user.name} ({user.email})</span>
                          <button
                            style={{ marginLeft: 'auto' }}
                            onClick={() => {
                              setAssignedUsersForEditing(prev => prev.filter(id => id !== user.id));
                            }}
                          >
                            ❌
                          </button>
                        </li>
                      ) : null;
                    })}
                  </ul>

                  <Select
                    value={selectedUserToAdd}
                    options={users
                      .filter(user => !assignedUsersForEditing.includes(user.id))
                      .map(user => ({
                        value: user.id,
                        label: `${user.name} (${user.email})`,
                        userData: user
                      }))
                    }
                    onChange={(selected) => {
                      if (selected) {
                        setAssignedUsersForEditing(prev => [...prev, selected.value]);
                        setSelectedUserToAdd(null);
                      }
                    }}
                    placeholder="Seleccionar usuario para asignar..."
                    formatOptionLabel={(option) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img
                          src={`http://localhost/myapp/backend/uploads/${option.userData.profile_picture || 'default.png'}`}
                          alt={option.userData.name}
                          style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span>{option.userData.name} ({option.userData.email})</span>
                      </div>
                    )}
                  />

                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button onClick={handleSaveEditedUsers}>Guardar cambios</button>
                    <button onClick={() => {
                      setEditingTaskId(null);
                      setAssignedUsersForEditing([]);
                      setSelectedUserToAdd(null);
                    }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}