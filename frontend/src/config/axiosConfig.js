import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost/myapp/backend', // URL del servidor PHP
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true, // para enviar cookies de sesión
});

export default axiosInstance;
