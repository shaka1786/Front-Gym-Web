import { useEffect } from 'react';
import React from 'react';
import axios from 'axios';

export default function TestApi() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/usuarios', {  // Corrige a '/api/usuarios' si es el caso (verifica rutas en backend)
          headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvX2VsZWN0cm9uaWNvIjoiYWRtaW5AZ3ltLmNvbSIsInJvbCI6IkFkbWluIiwiaWF0IjoxNzYyMDYwNDQ2LCJleHAiOjE3NjIwNjQwNDZ9.JtoU_MMwo9xRfH3LOeg0wEztOiju99LtUKf0ah0VlQM' }  // Reemplaza con TU_TOKEN real
        });
        console.log('Respuesta de la API:', response.data);  // Verifica aquí los usuarios
      } catch (error) {
        console.error('Error en la solicitud:', error.response?.data || error.message);
      }
    };

    fetchData();  // Ejecuta al montar
  }, []);

  return (
    <div>
      <h1>Probando API de Usuarios</h1>
      <p>Revisa la consola del navegador para ver la respuesta.</p>
    </div>
  );
}