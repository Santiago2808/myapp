import { useEffect, useState } from 'react';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Header from '../components/Header'; // Importa el header
import Sidebar from '../components/Sidebar';

export default function Dashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePic, setProfilePic] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('get-users.php');
        setUsers(res.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchProfilePic = async () => {
      try {
        const res = await axios.get('get-profile-picture.php');
        setProfilePic(res.data.picture);
      } catch (error) {
        console.error('Error cargando foto de perfil:', error);
      }
    };

    fetchUsers();
    fetchProfilePic();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get('logout.php');
      if (res.data.success) {
        alert('Sesión cerrada');
        onLogout();
      } else {
        alert('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un error al intentar cerrar sesión.');
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleUserInfo = () => setShowUserInfo((prev) => !prev);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Selecciona una imagen');

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);

    try {
      const res = await axios.post('upload-profile-picture.php', formData);
      if (res.data.success) {
        setProfilePic(res.data.filename);
        alert('Imagen actualizada');

        const updatedUsers = await axios.get('get-users.php');
        setUsers(updatedUsers.data.users);
      } else {
        console.log('Respuesta del servidor con error lógico:', res.data);
        alert('Error al subir imagen: ' + res.data.message);
      }
    } catch (err) {
      console.log('Error técnico al subir imagen:', err);
      alert('Error técnico al subir imagen');
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        toggleSidebar={toggleSidebar}
        toggleUserInfo={toggleUserInfo}
        profilePic={profilePic}
      />

      
      <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} />

      <div className="content" style={{ marginTop: '60px' }}>
        {showUserInfo && (
          <div className="user-info-box">
            <h4>{user?.name}</h4>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Actualizar foto</button>
          </div>
        )}

        <div className="main-content">
          <table className="user-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <img
                        src={`http://localhost/myapp/backend/uploads/${user.profile_picture}`}
                        alt="Foto"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
