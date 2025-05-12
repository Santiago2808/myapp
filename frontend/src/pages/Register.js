import { useState } from 'react';
import axios from '../config/axiosConfig';
import './Form.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async () => {
    try {
      const res = await axios.post('register.php', { name, email, password });

      if (res.data.success) {
        alert("Registrado con éxito. Ahora inicia sesión.");
        setName(''); setEmail(''); setPassword('');
        setError('');
      } else {
        setError(res.data.message || "Error desconocido.");
      }
    } catch (err) {
      setError("Error en la conexión con el servidor.");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Registro</h2>
      {error && <div className="error">{error}</div>}
      <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Registrarse</button>
    </div>
  );
}
