import { useState, useEffect } from 'react';
import api from '../api';

export default function Registro() {
  const [formData, setFormData] = useState({
    id_rol: '',
    nombre: '',
    correo_electronico: '',
    contrasena: '',
    programa: '',
    eps: '',
    peso_inicial: '',
    id_horario_laboral: '', // Agregado para colaboradores/entrenadores
    fecha_vencimiento: null,
  });

  const [roles, setRoles] = useState([]); // Fetch roles desde API
  const [horarios, setHorarios] = useState([]); // Fetch horarios
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await api.get('/roles'); // Asume ruta GET /api/roles en backend (agrega si no existe)
        setRoles(rolesRes.data);
        const horariosRes = await api.get('/horarios');
        setHorarios(horariosRes.data);
      } catch (err) {
        setError('Error al cargar datos');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const incompletos = Object.values(formData).some((campo) => campo.trim() === '');
    if (incompletos) {
      setError('Por favor completa todos los campos.');
      return;
    }
    try {
      await api.post('/auth/register', formData); // Envía a backend
      setRegistroExitoso(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en registro');
    }
  };

  const inputStyle = { /* ... estilos existentes */ };

  return (
    <form onSubmit={handleSubmit}>
      <select name="id_rol" value={formData.id_rol} onChange={handleChange} style={inputStyle}>
        <option value="">Selecciona Rol</option>
        {roles.map((rol) => (
          <option key={rol.id} value={rol.id}>{rol.nombre}</option>
        ))}
      </select>
      <input name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} style={inputStyle} />
      <input name="correo_electronico" type="email" placeholder="Correo electrónico" value={formData.correo_electronico} onChange={handleChange} style={inputStyle} />
      <input name="contrasena" type="password" placeholder="Contrasena" value={formData.contrasena} onChange={handleChange} style={inputStyle} />
      <input name="programa" placeholder="Programa académico" value={formData.programa} onChange={handleChange} style={inputStyle} />
      <input name="eps" placeholder="EPS" value={formData.eps} onChange={handleChange} style={inputStyle} />
      <input name="peso_inicial" type="number" placeholder="Peso inicial (kg)" value={formData.peso_inicial} onChange={handleChange} style={inputStyle} />
      <select name="id_horario_laboral" value={formData.id_horario_laboral} onChange={handleChange} style={inputStyle}>
        <option value="">Selecciona Horario (si aplica)</option>
        {horarios.map((horario) => (
          <option key={horario.id} value={horario.id}>{horario.descripcion}</option>
        ))}
      </select>
      <button type="submit" /* estilos */>Enviar registro</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {registroExitoso && <p style={{ color: 'green' }}>¡Registro exitoso! Inicia sesión.</p>}
    </form>
  );
}