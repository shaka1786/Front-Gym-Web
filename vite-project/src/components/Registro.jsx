import { useState } from 'react';

export default function Registro() {
const [formData, setFormData] = useState({
    id_rol: '',
    nombre: '',
    correo: '',
    contraseña: '',
    programa: '',
    eps: '',
    peso: '',
    horario: '',
    peso_inicial: ''
});

const [registroExitoso, setRegistroExitoso] = useState(false);
const [error, setError] = useState('');

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = (e) => {
    e.preventDefault();
    const incompletos = Object.values(formData).some(campo => campo.trim() === '');
    if (incompletos) {
    setError('Por favor completa todos los campos.');
    setRegistroExitoso(false);
    } else {
    setError('');
    setRegistroExitoso(true);
    }
};

const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc'
};

return (
    <form onSubmit={handleSubmit}>
    <input name="id_rol" placeholder="ID Rol" value={formData.id_rol} onChange={handleChange} style={inputStyle} />
    <input name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} style={inputStyle} />
    <input name="correo" type="email" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} style={inputStyle} />
    <input name="contraseña" type="password" placeholder="Contraseña" value={formData.contraseña} onChange={handleChange} style={inputStyle} />
    <input name="programa" placeholder="Programa académico" value={formData.programa} onChange={handleChange} style={inputStyle} />
    <input name="eps" placeholder="EPS" value={formData.eps} onChange={handleChange} style={inputStyle} />
    <input name="peso" type="number" placeholder="Peso actual (kg)" value={formData.peso} onChange={handleChange} style={inputStyle} />
    <input name="horario" placeholder="Horario laboral" value={formData.horario} onChange={handleChange} style={inputStyle} />
    <input name="peso_inicial" type="number" placeholder="Peso inicial (kg)" value={formData.peso_inicial} onChange={handleChange} style={inputStyle} />
    <button type="submit" style={{
        backgroundColor: '#001f3f',
        color: 'white',
        padding: '0.8rem 1.5rem',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    }}>
        Enviar registro
    </button>
    {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    {registroExitoso && <p style={{ color: 'green', marginTop: '1rem', fontWeight: 'bold' }}>¡Registro exitoso!</p>}
    </form>
);
}
