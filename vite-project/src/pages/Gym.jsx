import React from 'react';
import { useState, useEffect } from 'react';

import img1 from '../assets/image1.PNG';
import img2 from '../assets/image2.PNG';
import img3 from '../assets/image3.PNG';
import Registro from '../components/Registro';
import { useAuth } from '../hooks/useAuth';
import api from '../api';

export default function Gym() {
  const { user, login, logout } = useAuth();
  const [showRegistro, setShowRegistro] = useState(false);
  const [loginData, setLoginData] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const [tiposMembresia, setTiposMembresia] = useState([]);
  const [selectedPago, setSelectedPago] = useState('');

  useEffect(() => {
    if (user) {
      fetchTiposMembresia();
    }
  }, [user]);

  const fetchTiposMembresia = async () => {
    try {
      const res = await api.get('/tipoMembresia');
      setTiposMembresia(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.correo, loginData.password);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en login');
    }
  };

  const handlePago = async () => {
    if (!selectedPago) return;
    try {
      await api.post('/pagos', { id_usuario: user.id, id_pago: selectedPago, descripcion: 'Pago membresía' });
      alert('Pago realizado!');
    } catch (err) {
      setError('Error en pago');
    }
  };

  return (
    <div style={{ /* estilos existentes */ }}>
      <h1>Campus FIT</h1>
      <div style={{ /* imágenes */ }}>
        {/* Imágenes existentes */}
      </div>
      <div style={{ /* recuadro */ }}>
        <h2>Bienvenido al entorno de bienestar</h2>
        <p>{/* texto existente */}</p>

        {!user ? (
          <>
            {/* Formulario de login */}
            <form onSubmit={handleLogin}>
              <input name="correo" type="email" placeholder="Correo electrónico" value={loginData.correo} onChange={handleLoginChange} /* estilos */ />
              <input name="password" type="password" placeholder="Contraseña" value={loginData.password} onChange={handleLoginChange} /* estilos */ />
              <button type="submit" /* estilos */>Entrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>¿No tienes cuenta?</p>
            <button onClick={() => setShowRegistro(!showRegistro)} /* estilos */>Registrarse</button>
            {showRegistro && <Registro />}
          </>
        ) : (
          <>
            <p>Bienvenido, {user.nombre} ({user.rol})</p>
            <button onClick={logout}>Logout</button>
            {/* Sección de pagos */}
            <h3>Realizar Pago de Membresía</h3>
            <select value={selectedPago} onChange={(e) => setSelectedPago(e.target.value)}>
              <option value="">Selecciona</option>
              {tiposMembresia.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.tiempo} días - ${tipo.valor}</option>
              ))}
            </select>
            <button onClick={handlePago}>Pagar</button>
            {/* Si es Admin, link a /admin */}
            {user.rol === 'Admin' && <a href="/admin">Panel Admin</a>}
          </>
        )}
      </div>
    </div>
  );
}