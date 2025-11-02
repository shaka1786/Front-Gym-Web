import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Gym from './pages/Gym';
import AdminPanel from './pages/AdminPanel';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const location = useLocation();
  const { loading } = useAuth(); // Carga auth

  if (loading) return <p>Cargando...</p>;

  const showTopBar = location.pathname === '/';

  return (
    <>
      {showTopBar && <TopBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/admin" element={<AdminPanel />} /> {/* Protegida por rol en el componente */}
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
/*import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Gym from './pages/Gym';

function AppContent() {
  const location = useLocation();

  // Mostrar TopBar solo en la página principal
  const showTopBar = location.pathname === '/';

  return (
    <>
      {showTopBar && <TopBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gym" element={<Gym />} />
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
}*/
