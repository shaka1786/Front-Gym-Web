import { useState, useEffect } from 'react';
import api from '../api';

// Decodificador robusto sin dependencia externa
export const decodeJwt = (token) => {
  try {
    const parts = String(token || '').split('.');
    const payload = parts[1];
    if (!payload) return null;

    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);

    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (err) {
    console.error('decodeJwt error:', err);
    return null;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Declaración clara de fetchUser
  async function fetchUser() {
    try {
      const res = await api.get('/me');
      setUser(res.data);
    } catch (err) {
      console.error('fetchUser error:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const decoded = decodeJwt(token);
    if (decoded) {
      // Ajusta según tu payload real
      setUser(decoded.user ?? decoded);
      // Opcional: traer datos frescos del backend
      fetchUser();
    } else {
      // token inválido -> limpieza
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (correo, password) => {
    const res = await api.post('/login', { correo_electronico: correo, password });
    localStorage.setItem('token', res.data.token);
    await fetchUser();
  };

  const register = async (data) => {
    await api.post('/register', data);
    // Si quieres: hacer auto-login aquí
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // redirige o usa navigate según router
    window.location.href = '/gym';
  };

  return { user, loading, login, register, logout };
};