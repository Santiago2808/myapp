import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambio aquí
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';

// Crear un root para React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Usar el método 'render' del root
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
