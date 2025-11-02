import { Link } from 'react-router-dom';
import './TopBar.css';
import logo from '../assets/logo.PNG';
import React from 'react';

export default function TopBar() {
return (
    <div className="top-bar">
    <div className="top-left">
        <img src={logo} alt="Logo institucional" className="logo" />
    </div>
    <ul className="top-menu">
        <li>INSTITUCIONAL</li>
        <li>PROGRAMAS</li>
        <li>PORTAL DOCENTE</li>
        <li>ADMISIONES</li>
        <li><Link to="/gym">CAMPUS FIT</Link></li> {/* Solo este es funcional */}
        <li>CARTERA</li>
        <li>BIBLIOTECA</li>
        <li>EMPRESAS</li>
        <li>PASTORAL</li>
    </ul>
    </div>
);
}