// src/components/Sidebar.js
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Puedes mover los estilos relacionados aquí

export default function Sidebar({ isOpen, onLogout }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{ marginTop: '60px' }}>
      <h3>Menú</h3>
      <ul>
        <li><Link to="/dashboard">Inicio</Link></li>
        <li><Link to="#">Prueba</Link></li>
        <li><Link to="#">Usuarios</Link></li>
        <li><Link to="#">Ajustes</Link></li>
        <li><Link to="/projects">Proyectos <span style={{ fontWeight: 'bold', fontSize: '20px' }}>+</span></Link></li>
        <li><Link to="/my-tasks">Tareas asignadas</Link></li>
        <li><button onClick={onLogout} className="logout-button">Cerrar sesión</button></li>
      </ul>
    </div>
  );
}
