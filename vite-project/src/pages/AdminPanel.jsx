import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api';


export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [sesiones, setSesiones] = useState([]);

  useEffect(() => {
    if (user?.rol !== 'Admin') {
      window.location.href = '/gym'; // Redirige si no es Admin
      return;
    }
    fetchUsuarios();
    fetchSesiones();
  }, [user]);

  const fetchUsuarios = async () => {
    const res = await api.get('/usuarios');
    setUsuarios(res.data);
  };

  const fetchSesiones = async () => {
    const res = await api.get('/sesiones');
    setSesiones(res.data);
  };

  const deleteUser = async (id) => {
    if (window.confirm('¿Eliminar usuario?')) {
      await api.delete(`/usuarios/${id}`);
      fetchUsuarios();
    }
  };

  const deleteSesion = async (id) => {
    if (window.confirm('¿Eliminar sesión?')) {
      await api.delete(`/sesiones/${id}`);
      fetchSesiones();
    }
  };

  return (
    <div>
      <h1>Panel Admin</h1>
      <button onClick={logout}>Logout</button>
      <h2>Usuarios</h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nombre} ({u.rol.nombre}) - <button onClick={() => deleteUser(u.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <h2>Sesiones</h2>
      <ul>
        {sesiones.map((s) => (
          <li key={s.id}>
            Entrenador: {s.Entrenador.nombre} - Horario: {s.HorarioLaboral.descripcion} - <button onClick={() => deleteSesion(s.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      {/* Agrega más: e.g., formulario para crear sesiones, tipos membresía, etc. */}
    </div>
  );
}