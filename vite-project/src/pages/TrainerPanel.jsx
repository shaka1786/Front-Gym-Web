import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

export default function TrainerPanel() {
  const { user } = useAuth();
  const [emailBusqueda, setEmailBusqueda] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);

  const [misHorarios, setMisHorarios] = useState([]); 
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(''); 
  
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        // Llamamos al nuevo endpoint
        const res = await api.get('/entrenador/mis-horarios');
        setMisHorarios(res.data);
      } catch (error) {
        console.error("Error cargando horarios:", error);
        setMensaje({ texto: 'Error al cargar horarios', tipo: 'error' });
      }
    };
    cargarHorarios();
  }, []);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    setCargando(true);
    
    try {
      const res = await api.get(`/entrenador/buscar-usuario?email=${encodeURIComponent(emailBusqueda)}`);
      setUsuarioEncontrado(res.data);
      setMensaje({ 
        texto: 'Usuario encontrado', 
        tipo: 'success' 
      });
    } catch (error) {
      setUsuarioEncontrado(null);
      setMensaje({ 
        texto: error.response?.data?.message || 'Usuario no encontrado', 
        tipo: 'error' 
      });
    } finally {
      setCargando(false);
    }
  };

  // Marcar asistencia
const handleMarcarAsistencia = async () => {
    if (!usuarioEncontrado || !horarioSeleccionado) {
      setMensaje({ texto: 'Selecciona un horario y busca un usuario', tipo: 'error' });
      return;
    }

    setCargando(true);
    try {
      const res = await api.post('/entrenador/asistencia', {
        id_usuario: usuarioEncontrado.id,
        id_horario: horarioSeleccionado // <-- Aquí el cambio
      });
      
      setMensaje({ texto: `✅ ${res.data.message}`, tipo: 'success' });
      
      setTimeout(() => {
        setEmailBusqueda('');
        setUsuarioEncontrado(null);
        // setHorarioSeleccionado(''); // Opcional: puedes dejar el horario seleccionado si vas a marcar a varios seguidos
      }, 2000);
    } catch (error) {
      setMensaje({ texto: error.response?.data?.message || 'Error al marcar', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">
        🏋️ Panel de Entrenador
      </h1>
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        
        {/* Selección de sesión */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">
            1. Selecciona tu Horario:
          </label>
          <select 
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 outline-none"
            value={horarioSeleccionado}
            onChange={(e) => setHorarioSeleccionado(e.target.value)}
            disabled={cargando}
          >
            <option value="">-- Seleccionar Horario --</option>
            {misHorarios.map(horario => (
              <option key={horario.id} value={horario.id}>
                {horario.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Buscar usuario por correo */}
        <form onSubmit={handleBuscar} className="mb-6">
          <label className="block text-gray-400 mb-2">
            2. Buscar por Correo:
          </label>
          <div className="flex gap-2">
            <input 
              type="email" 
              required
              placeholder="usuario@correo.com"
              className="flex-1 p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 outline-none"
              value={emailBusqueda}
              onChange={(e) => setEmailBusqueda(e.target.value)}
              disabled={cargando}
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 px-4 rounded font-bold transition disabled:bg-blue-400"
              disabled={cargando}
            >
              {cargando ? '⌛' : '🔍'}
            </button>
          </div>
        </form>

        {/* Usuario Encontrado */}
        {usuarioEncontrado && (
          <div className="bg-gray-700 p-4 rounded-lg mb-6 border border-emerald-500/30">
            <p className="font-bold text-lg text-emerald-300">
              {usuarioEncontrado.nombre}
            </p>
            <p className="text-sm text-gray-300">
              {usuarioEncontrado.correo_electronico}
            </p>
            {usuarioEncontrado.programa && (
              <p className="text-sm text-gray-300">
                Programa: {usuarioEncontrado.programa}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Vence: {usuarioEncontrado.fecha_vencimiento 
                ? new Date(usuarioEncontrado.fecha_vencimiento).toLocaleDateString() 
                : 'Sin fecha'}
            </p>
            
            <button 
              onClick={handleMarcarAsistencia}
              disabled={cargando || !horarioSeleccionado}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 py-2 rounded font-bold text-white transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {cargando ? 'Marcando...' : '✅ Marcar Asistencia'}
            </button>
          </div>
        )}

        {/* Mensajes */}
        {mensaje.texto && (
          <div className={`p-3 rounded text-center ${
            mensaje.tipo === 'error' 
              ? 'bg-red-500/20 text-red-200 border border-red-500/30' 
              : 'bg-green-500/20 text-green-200 border border-green-500/30'
          }`}>
            {mensaje.texto}
          </div>
        )}
      </div>
    </div>
  );
}