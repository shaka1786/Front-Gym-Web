import { Link } from 'react-router-dom';
import './Navbar.css'; // Importamos los estilos

export default function Navbar() {
return (
    <nav className="navbar">
    <ul className="nav-list">
        <li><Link to="/">Institucional</Link></li>
        <li><Link to="/programas">Programas</Link></li>
        <li><Link to="/gimnasio">Gimnasio</Link></li>
        <li><Link to="/pastoral">Pastoral</Link></li>
        <li><Link to="/idiomas">Idiomas</Link></li>
    </ul>
    </nav>
);
}
