import { useState } from 'react';
import axios from '../config/axiosConfig';
import './Form.css';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post('login.php', { email, password });
  
      console.log('Respuesta del backend:', res); // 🛠️ LOG importante
  
      if (res?.data?.success && res?.data?.user) {
        onLogin(res.data.user);
        navigate('/dashboard');
      } else if (res?.data?.message) {
        alert(res.data.message);
        console.log('Mensaje del backend:', res.data.message); // 🔥 Otro LOG
      } else {
        console.error('Respuesta inesperada:', res.data); // 🛠️ Nuevo
        alert('Error desconocido al iniciar sesión.\nDetalle: ' + JSON.stringify(res.data));
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (error.response) {
        console.error('Respuesta error:', error.response.data);
        alert('Error en la respuesta del servidor.\nDetalle: ' + JSON.stringify(error.response.data));
      } else {
        alert('Error de conexión.');
      }
    }
  };
  

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <input
        placeholder="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={login}>Entrar</button>
    </div>
  );
}
