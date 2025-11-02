import { useState, useEffect } from 'react';
import api from '../api'; // usa tu instancia con baseURL y interceptor

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

  const [roles, setRoles] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Normaliza distintos formatos a array de objetos
  const normalizeToArrayOfObjects = (raw, itemName = 'item') => {
    if (Array.isArray(raw)) return raw;
    if (raw == null) return [];

    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      // Detectar HTML (index.html retornado por Vite)
      if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
        console.error(`[normalize] ${itemName} es HTML (probablemente la ruta apunta al frontend):`, raw.slice(0, 200));
        // lanzamos para que el fetch pueda manejar el error
        throw new Error(`Respuesta HTML recibida en ${itemName} — ruta backend incorrecta o backend no disponible`);
      }

      console.debug(`[normalize] ${itemName} es string, intentando JSON.parse ->`, raw);
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object') return [parsed];
        return [{ id: 1, nombre: String(parsed) }];
      } catch (parseErr) {
        console.warn(`[normalize] ${itemName} string no JSON, se convertirá por comas:`, raw);
        const parts = raw.split(',').map(p => p.trim()).filter(Boolean);
        return parts.map((p, i) => ({ id: i + 1, nombre: p }));
      }
    }

    if (typeof raw === 'object') {
      console.debug(`[normalize] ${itemName} es objeto, comprobando propiedades ->`, raw);
      if (Array.isArray(raw.roles)) return raw.roles;
      if (Array.isArray(raw.horarios)) return raw.horarios;
      if (Array.isArray(raw.data)) return raw.data;
      // si es un solo objeto
      return [raw];
    }

    console.warn(`[normalize] ${itemName} tiene formato inesperado, se devolverá []`, raw);
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usamos la instancia api (baseURL ya configurado)
        const rolesRes = await api.get('/rol');
        console.debug('Respuesta /rol ->', rolesRes);
        const rolesData = normalizeToArrayOfObjects(rolesRes.data, 'roles');
        setRoles(rolesData);
      } catch (err) {
        // Si err.response existe, es respuesta del servidor; si no, es error de fetch o thrown error
        console.error('Error fetching roles:', err?.response ?? err);
        setError('Error al cargar roles. Revisa la consola para más detalles.');
        return;
      }

      try {
        const horariosRes = await api.get('/horarios');
        console.debug('Respuesta /horarios ->', horariosRes);
        const horariosData = normalizeToArrayOfObjects(horariosRes.data, 'horarios');
        setHorarios(horariosData);
      } catch (err) {
        console.error('Error fetching horarios:', err?.response ?? err);
        setError('Error al cargar horarios. Revisa la consola para más detalles.');
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
      // Usamos api.post (baseURL + /auth/usuarios)
      const res = await api.post('/auth/usuarios', formData);
      console.debug('Registro exitoso ->', res);
      setSuccess('Usuario registrado exitosamente');
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
      console.error('Error al registrar usuario:', err?.response ?? err);
      // Mostrar más detalle si está disponible
      const msg = err?.response?.data?.message || err?.response?.statusText || 'Error al registrar';
      setError(msg);
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
        {Array.isArray(roles) && roles.map((rol) => (
          <option key={rol.id ?? rol.nombre ?? Math.random()} value={rol.id ?? rol.nombre}>
            {rol.nombre ?? String(rol)}
          </option>
        ))}
      </select>

      {isEntrenador && (
        <select name="id_horario_laboral" value={formData.id_horario_laboral} onChange={handleChange} required>
          <option value="">Selecciona Horario</option>
          {Array.isArray(horarios) && horarios.map((horario) => (
            <option key={horario.id ?? horario.descripcion ?? Math.random()} value={horario.id ?? horario.descripcion}>
              {horario.descripcion ?? String(horario)}
            </option>
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
