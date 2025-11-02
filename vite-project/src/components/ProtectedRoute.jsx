import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    if (!allowedRoles.includes(decoded.rol)) {
      return <Navigate to="/login" />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;