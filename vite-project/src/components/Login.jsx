import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { correo_electronico: email, password });
      localStorage.setItem('token', res.data.token);
      // Redirigir a dashboard o home (agrega lógica si necesitas)
      window.location.href = '/admin/register'; // Ejemplo: redirige a registro si es admin
    } catch (err) {
      setError(err.response?.data?.message || 'Error en login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
      {/* Removido: cualquier link o form de registro */}
    </form>
  );
};

export default Login;