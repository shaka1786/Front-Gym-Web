import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminRegister() {
  const navigate = useNavigate();

  // Estado del formulario de registro
  const [formData, setFormData] = useState({
    nombre: '',
    correo_electronico: '',
    contrasena: '',
    id_rol: '',
    id_horarios: [], // array de IDs de horarios, para entrenadores
    programa: '',    // para estudiantes
    eps: '',
    peso_inicial: ''
  });

  // Listado de roles y horarios obtenidos del backend
  const [roles, setRoles] = useState([]);
  const [horarios, setHorarios] = useState([]);

  // Mensajes de error y éxito
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 🧠 Carga roles y horarios desde el backend cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await api.get('/roles');
        setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
      } catch {
        setError('Error cargando roles');
      }

      try {
        const horariosRes = await api.get('/horarios');
        setHorarios(Array.isArray(horariosRes.data) ? horariosRes.data : []);
      } catch {
        setError('Error cargando horarios');
      }
    };
    fetchData();
  }, []);

  // 📝 Maneja cambios en inputs y select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 📝 Maneja checkboxes de horarios (solo para entrenadores)
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const arr = Array.isArray(prev.id_horarios) ? prev.id_horarios : [];
      if (checked) return { ...prev, id_horarios: [...arr, value] };
      else return { ...prev, id_horarios: arr.filter(v => v !== value) };
    });
  };

  // 🧾 Envía el formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!formData.nombre || !formData.correo_electronico || !formData.contrasena || !formData.id_rol) {
      return setError('Campos obligatorios faltantes');
    }

    try {
      await api.post('/usuarios', formData);
      setSuccess('Usuario registrado exitosamente ✅');
      // Resetea el formulario
      setFormData({
        nombre: '',
        correo_electronico: '',
        contrasena: '',
        id_rol: '',
        id_horarios: [],
        programa: '',
        eps: '',
        peso_inicial: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    }
  };

  // 🔹 Determina si se muestra el campo de programa o horarios según rol
  const isEstudiante = formData.id_rol === '2';
  const isEntrenador = formData.id_rol === '7';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center p-6">
      <div className="bg-gray-900/80 p-6 rounded-2xl shadow-xl w-full max-w-lg text-white backdrop-blur relative">
        
        {/* Botón para volver a la página anterior */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-lg font-semibold transition-all mb-4"
        >
          ← Volver
        </button>

        {/* Título del formulario */}
        <h2 className="text-3xl font-bold text-emerald-400 mb-4 text-center">
          Registrar Nuevo Usuario
        </h2>

        {/* Formulario de registro */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Campos de texto básicos */}
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
            className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            name="correo_electronico"
            type="email"
            value={formData.correo_electronico}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            name="contrasena"
            type="password"
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="Contraseña"
            required
            className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Select de rol */}
          <select
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Selecciona Rol</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>

          {/* Campo adicional solo para estudiantes */}
          {isEstudiante && (
            <input
              name="programa"
              value={formData.programa}
              onChange={handleChange}
              placeholder="Programa Académico"
              required
              className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          )}

          {/* Checkbox de horarios solo para entrenadores */}
          {isEntrenador && (
            <div className="border border-gray-700 p-3 rounded-lg">
              <p className="mb-2 font-semibold">Horarios disponibles:</p>
              {horarios.map(h => (
                <label key={h.id} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    value={h.id}
                    checked={formData.id_horarios.includes(String(h.id))}
                    onChange={handleCheckboxChange}
                    className="accent-emerald-500"
                  />
                  {h.descripcion}
                </label>
              ))}
            </div>
          )}

          {/* Otros campos opcionales */}
          <input
            name="eps"
            value={formData.eps}
            onChange={handleChange}
            placeholder="EPS"
            className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            name="peso_inicial"
            type="number"
            step="0.01"
            value={formData.peso_inicial}
            onChange={handleChange}
            placeholder="Peso Inicial"
            className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Botón de enviar */}
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg font-semibold mt-2 transition-all"
          >
            Registrar
          </button>
        </form>

        {/* Mensajes de error o éxito */}
        {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
        {success && <p className="text-green-400 mt-3 text-center">{success}</p>}
      </div>
    </div>
  );
}
