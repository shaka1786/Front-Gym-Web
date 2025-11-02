// main.jsx/
/*
import React from 'react';
import { createRoot } from 'react-dom/client';
import TestApi from "./pages/TestApi"; // <-- Importa tu componente de prueba

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApi />  
  </React.StrictMode>
);
*/

import React from 'react';                   
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);