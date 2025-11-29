import React from 'react'; // <-- la runa perdida, ahora restaurada
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Gym from './pages/Gym';
import AdminPanel from './pages/AdminPanel';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login'; // Asumiendo que existe
import AdminRegister from './components/AdminRegister'; // Nuevo
import ProtectedRoute from './components/ProtectedRoute'; // Nuevo
import TrainerPanel from './pages/TrainerPanel';

function AppContent() {
  const location = useLocation();
  const { loading } = useAuth(); // Carga del hechizo de autenticación

  if (loading) return <p>Cargando...</p>;

  // Muestra la TopBar solo en la raíz
  const showTopBar = location.pathname === '/';

  return (
    <>
      {showTopBar && <TopBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/admin" element={<AdminPanel />} /> {/* Protegida por rol en el componente */}
        <Route path="/login" element={<Login />} />
        <Route 
          path="/trainer" 
          element={
            <ProtectedRoute allowedRoles={['Entrenador']}>
              <TrainerPanel />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/admin/register"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminRegister />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}