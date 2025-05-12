import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario está logueado, redirigir al dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>Bienvenido a la App</h1>
      <p>¿Deseas iniciar sesión o registrarte?</p>
      {!user && (  // Mostrar botones solo si el usuario no está logueado
        <>
          <button onClick={() => navigate('/login')} style={{ margin: '10px' }}>
            Iniciar sesión
          </button>
          <button onClick={() => navigate('/register')} style={{ margin: '10px' }}>
            Registrarme
          </button>
        </>
      )}
    </div>
  );
}
