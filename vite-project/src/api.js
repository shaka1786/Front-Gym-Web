import axios from 'axios';


//const API_URL = 'http://localhost:3000/api'; // Ajusta si backend corre en otro puerto/host

const api = axios.create({
  //baseURL: API_URL,
  baseURL: '/api',
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de errores global (e.g., 401 → logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/gym'; // Redirige a login
    }
    return Promise.reject(error);
  }
);

export default api;