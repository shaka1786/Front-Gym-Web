// import { useState, useEffect } from 'react';
// import React from 'react';
// import { useAuth } from '../hooks/useAuth';
// import api from '../api';


// export default function AdminPanel() {
//   const { user, logout } = useAuth();
//   const [usuarios, setUsuarios] = useState([]);
//   const [sesiones, setSesiones] = useState([]);

//   useEffect(() => {
//     if (user?.rol !== 'Admin') {
//       window.location.href = '/gym'; // Redirige si no es Admin
//       return;
//     }
//     fetchUsuarios();
//     fetchSesiones();
//   }, [user]);

//   const fetchUsuarios = async () => {
//     const res = await api.get('/usuarios');
//     setUsuarios(res.data);
//   };

//   const fetchSesiones = async () => {
//     const res = await api.get('/sesiones');
//     setSesiones(res.data);
//   };

//   const deleteUser = async (id) => {
//     if (window.confirm('¿Eliminar usuario?')) {
//       await api.delete(`/usuarios/${id}`);
//       fetchUsuarios();
//     }
//   };

//   const deleteSesion = async (id) => {
//     if (window.confirm('¿Eliminar sesión?')) {
//       await api.delete(`/sesiones/${id}`);
//       fetchSesiones();
//     }
//   };

//   return (
//     <div>
//       <h1>Panel Admin</h1>
//       <button onClick={logout}>Logout</button>
//       <h2>Usuarios</h2>
//       <ul>
//         {usuarios.map((u) => (
//           <li key={u.id}>
//             {u.nombre} ({u.rol.nombre}) - <button onClick={() => deleteUser(u.id)}>Eliminar</button>
//           </li>
//         ))}
//       </ul>
//       <h2>Sesiones</h2>
//       <ul>
//         {sesiones.map((s) => (
//           <li key={s.id}>
//             Entrenador: {s.Entrenador.nombre} - Horario: {s.HorarioLaboral.descripcion} - <button onClick={() => deleteSesion(s.id)}>Eliminar</button>
//           </li>
//         ))}
//       </ul>
//       {/* Agrega más: e.g., formulario para crear sesiones, tipos membresía, etc. */}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo_electronico: '',
    contrasena: '',
    id_rol: '',
    id_horario_laboral: '',
    programa: '',
    eps: '',
    peso_inicial: ''
  });
  const [roles, setRoles] = useState([]);           // siempre array
  const [horarios, setHorarios] = useState([]);     // siempre array
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Trae roles
        const rolesRes = await axios.get('/api/rol', config);
        // Aseguramos que roles sea un array (manejo de formatos distintos)
        const rolesData = Array.isArray(rolesRes.data)
          ? rolesRes.data
          : (rolesRes.data?.roles || []);
        setRoles(rolesData);

        // Trae horarios (similar protección)
        const horariosRes = await axios.get('/api/horarios', config);
        const horariosData = Array.isArray(horariosRes.data)
          ? horariosRes.data
          : (horariosRes.data?.horarios || []);
        setHorarios(horariosData);

      } catch (err) {
        console.error('Error fetching roles/horarios:', err);
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
    setError('');
    setSuccess('');

    // Validaciones frontend básicas
    if (!formData.nombre || !formData.correo_electronico || !formData.contrasena || !formData.id_rol) {
      return setError('Campos obligatorios faltantes');
    }
    if (formData.id_rol === '2' && !formData.programa) {
      return setError('Programa requerido para Estudiantes');
    }
    if (formData.id_rol === '7' && !formData.id_horario_laboral) {
      return setError('Horario laboral requerido para Entrenadores');
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post('/api/auth/usuarios', formData, config);
      setSuccess('Usuario registrado exitosamente');
      // limpieza de formulario opcional:
      setFormData({
        nombre: '',
        correo_electronico: '',
        contrasena: '',
        id_rol: '',
        id_horario_laboral: '',
        programa: '',
        eps: '',
        peso_inicial: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
    }
  };

  const isEstudiante = formData.id_rol === '2';
  const isEntrenador = formData.id_rol === '7';

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input name="correo_electronico" type="email" value={formData.correo_electronico} onChange={handleChange} placeholder="Correo" required />
      <input name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} placeholder="Contraseña" required />
      
      <select name="id_rol" value={formData.id_rol} onChange={handleChange} required>
        <option value="">Selecciona Rol</option>
        {/* Protegemos con Array.isArray por si acaso */}
        {Array.isArray(roles) && roles.map((rol) => (
          <option key={rol.id} value={rol.id}>{rol.nombre}</option>
        ))}
      </select>
      
      {isEntrenador && (
        <select name="id_horario_laboral" value={formData.id_horario_laboral} onChange={handleChange} required>
          <option value="">Selecciona Horario</option>
          {Array.isArray(horarios) && horarios.map((horario) => (
            <option key={horario.id} value={horario.id}>{horario.descripcion}</option>
          ))}
        </select>
      )}
      
      {isEstudiante && (
        <input name="programa" value={formData.programa} onChange={handleChange} placeholder="Programa Académico" required />
      )}
      
      <input name="eps" value={formData.eps} onChange={handleChange} placeholder="EPS" />
      <input name="peso_inicial" type="number" step="0.01" value={formData.peso_inicial} onChange={handleChange} placeholder="Peso Inicial" />
      
      <button type="submit">Registrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default AdminRegister;
