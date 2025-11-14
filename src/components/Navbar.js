import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logoFrase from "../assets/logo-frase.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="nav-header">
      <div className="nav-container container">
        <Link to="/" className="brand">
          <img 
            src={logoFrase}
            alt="UrbanBarber" 
            className="brand-logo"
          />
        </Link>

        <button
          aria-label="toggle menu"
          className={`nav-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            Inicio
          </NavLink>
          
          <NavLink 
            to="/servicios" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            Servicios
          </NavLink>
          
          <NavLink 
            to="/barberos" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            Barberos
          </NavLink>
          
          <NavLink 
            to="/citas" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            Citas
          </NavLink>
          
          <NavLink 
            to="/contacto" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            Contacto
          </NavLink>
          
          <NavLink 
            to="/login" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            Iniciar sesión
          </NavLink>
          
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={darkMode ? "Modo claro" : "Modo oscuro"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;