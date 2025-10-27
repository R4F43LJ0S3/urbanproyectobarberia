import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-header">
      <div className="nav-container container">
        <Link to="/" className="brand">
          <img 
            src="/logo-frase.png" 
            alt="UrbanBarber" 
            className="brand-logo"
          />
        </Link>

        <button
          aria-label="toggle menu"
          className="nav-toggle"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Inicio
          </NavLink>
          <NavLink to="/servicios" className={({ isActive }) => (isActive ? "active" : "")}>
            Servicios
          </NavLink>
          <NavLink to="/citas" className={({ isActive }) => (isActive ? "active" : "")}>
            Citas
          </NavLink>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? "active" : "")}>
            Contacto
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

