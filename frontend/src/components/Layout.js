import { useEffect, useRef, useState } from 'react';
import axios from '../config/axiosConfig';
import Sidebar from './Sidebar';

export default function Layout({ children, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePic, setProfilePic] = useState('default.png');
  const userInfoRef = useRef(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const res = await axios.get('get-profile-picture.php');
        setProfilePic(res.data.picture || 'default.png');
      } catch (err) {
        console.error('Error obteniendo foto de perfil:', err);
      }
    };

    fetchProfilePic();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userInfoRef.current &&
        !userInfoRef.current.contains(event.target)
      ) {
        setShowUserInfo(false);
      }
    };

    if (showUserInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserInfo]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleUserInfo = () => setShowUserInfo(prev => !prev);

  const profileImage = `http://localhost/myapp/backend/uploads/${profilePic}`;

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
      } else {
        alert('Error al subir imagen: ' + res.data.message);
      }
    } catch (err) {
      alert('Error técnico al subir imagen');
      console.error(err);
    }
  };

  return (
    <div className="layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '60px', backgroundColor: '#fff', color: '#333',
        display: 'flex', alignItems: 'center', padding: '0 1rem',
        zIndex: 1000
      }}>
        <button onClick={toggleSidebar} style={{
          marginRight: '1rem', background: 'none',
          border: 'none', color: '#333', fontSize: '1.9rem'
        }}>
          ☰
        </button>

        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <img
            src={profileImage}
            alt="Foto de perfil"
            onClick={toggleUserInfo}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              objectFit: 'cover',
              cursor: 'pointer',
              border: '2px solid white'
            }}
          />
          {showUserInfo && (
            <div 
            ref={userInfoRef} // 👈 Ref aplicada aquí
            style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              backgroundColor: '#fff',
              color: '#000',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              zIndex: 999,
              width: '250px',
              overflowX: 'hidden'
            }}>
              <img
                src={profileImage}
                alt="Foto grande"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '0.5rem'
                }}
              />
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%' }} />
              <button onClick={handleUpload} style={{
                marginTop: '0.5rem', width: '100%',
                padding: '0.4rem', backgroundColor: '#007bff',
                color: '#fff', border: 'none',
                borderRadius: '4px', cursor: 'pointer'
              }}>
                Actualizar foto
              </button>
              <button onClick={onLogout} style={{
                marginTop: '0.5rem', width: '100%',
                padding: '0.4rem', backgroundColor: '#dc3545',
                color: '#fff', border: 'none',
                borderRadius: '4px', cursor: 'pointer'
              }}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contenido con Sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={isSidebarOpen} onLogout={onLogout} />
        <main style={{ flex: 1, marginTop: '60px', padding: '1rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}