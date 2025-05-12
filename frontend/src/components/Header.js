// src/pages/components/Header.js
import './Header.css';

export default function Header({ toggleSidebar, toggleUserInfo, profilePic }) {
  return (
    <header className="app-header">
      <div className="menu-toggle" onClick={toggleSidebar}>
        <div className="hamburger-icon"></div>
        <div className="hamburger-icon"></div>
        <div className="hamburger-icon"></div>
      </div>
      <h2>Usuarios registrados</h2>
      <div className="profile-circle" onClick={toggleUserInfo}>
        <img
          src={`http://localhost/myapp/backend/uploads/${profilePic}`}
          alt="Perfil"
        />
      </div>
    </header>
  );
}
