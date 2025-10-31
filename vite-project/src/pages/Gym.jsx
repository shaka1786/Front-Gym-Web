import { useState } from 'react';
import img1 from '../assets/image1.PNG';
import img2 from '../assets/image2.PNG';
import img3 from '../assets/image3.PNG';
import Registro from '../components/Registro';


export default function Gym() {
return (
    <div style={{
    backgroundColor: '#eae6ffff', 
    minHeight: '100vh',
    padding: '6rem'
    }}>
      {/* Título principal */}
    <h1 style={{
        color: '#00013fff',
        fontSize: '2.5rem',
        textAlign: 'center',
        marginBottom: '2rem'
    }}>
        Campus FIT
    </h1>

    <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '2rem'
    }}>
        <img src={img1} alt="Entrenamiento 1" style={{ width: '300px', borderRadius: '10px' }} />
        <img src={img2} alt="Entrenamiento 2" style={{ width: '300px', borderRadius: '10px' }} />
        <img src={img3} alt="Entrenamiento 3" style={{ width: '300px', borderRadius: '10px' }} />
    </div>

      {/* Recuadro de bienvenida + inicio de sesión */}
    <div style={{
        backgroundColor: '#f0f8ff',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '700px',
        margin: '0 auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        textAlign: 'center'
    }}>
        <h2 style={{ color: '#001f3f', marginBottom: '1rem' }}>
        Bienvenido al entorno de bienestar
        </h2>
        <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.6',
        color: '#333',
        marginBottom: '2rem'
        }}>
        Te invitamos a formar parte de nuestro espacio de salud y movimiento.<br />
        El gimnasio IUSH está diseñado para fortalecer cuerpo y mente,<br />
        promoviendo hábitos saludables y bienestar integral.<br />
        ¡Tu participación es el primer paso hacia una vida más activa!
        </p>

        {/* Formulario de inicio de sesión */}
        <form>
        <input
            type="email"
            placeholder="Correo electrónico"
            style={{
            width: '100%',
            padding: '0.8rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc'
            }}
        />
        <input
            type="password"
            placeholder="Contraseña"
            style={{
            width: '100%',
            padding: '0.8rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc'
            }}
        />
        <button type="submit" style={{
            backgroundColor: '#001f3f',
            color: 'white',
            padding: '0.8rem 1.5rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        }}>
            Entrar
        </button>
        </form>

        {/* Botón de registro */}
        <p style={{ marginTop: '1rem' }}>¿No tienes cuenta?</p>
        <button style={{
        backgroundColor: '#800080',
        color: 'white',
        padding: '0.6rem 1.2rem',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
        }}>
        Registrarse
        </button>
    </div>
    </div>
);
}
