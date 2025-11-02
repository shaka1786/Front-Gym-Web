import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      fetchUser(); // Fetch /api/auth/me para datos frescos
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (correo, password) => {
    const res = await api.post('/auth/login', { correo_electronico: correo, password });
    localStorage.setItem('token', res.data.token);
    await fetchUser();
  };

  const register = async (data) => {
    await api.post('/auth/register', data);
    // Opcional: Auto-login después de register
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/gym';
  };

  return { user, loading, login, register, logout };
};