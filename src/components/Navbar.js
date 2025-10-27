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
          {open ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setOpen(false)}
          >
            Inicio
          </NavLink>
          <NavLink to="/servicios" className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setOpen(false)}
          >
            Servicios
          </NavLink>
          <NavLink to="/citas" className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setOpen(false)}
          >
            Citas
          </NavLink>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setOpen(false)}
          >
            Contacto
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setOpen(false)}
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;