import React from "react";
import { Link } from "react-router-dom";

const servicios = [
  {
    id: 1,
    nombre: "Corte Sencillo",
    descripcion: "Corte clásico y limpio con acabado profesional.",
    duracion: "40 a 60 minutos",
    precio: "$25.000",
  },
  {
    id: 2,
    nombre: "Corte + Cejas",
    descripcion: "Corte preciso y diseño de cejas para un look completo.",
    duracion: "40 a 60 minutos",
    precio: "$25.000",
  },
  {
    id: 3,
    nombre: "Corte Premium (Cejas + Perfilado de Barba)",
    descripcion: "Servicio completo con corte, cejas y perfilado para un estilo impecable.",
    duracion: "20 a 30 minutos",
    precio: "$40.000",
  },
  {
    id: 4,
    nombre: "Perfilado de Barba",
    descripcion: "Definición exacta para resaltar la forma y el estilo de tu barba.",
    duracion: "15 a 20 minutos",
    precio: "$15.000",
  },
  {
    id: 5,
    nombre: "Corte + Tinturado de Cabello",
    descripcion: "Corte moderno con color personalizado y acabado profesional.",
    duracion: "30 a 40 minutos",
    precio: "$30.000",
  },
  {
    id: 6,
    nombre: "Corte + Mascarilla",
    descripcion: "Corte moderno con mascarilla facial para limpiar e hidratar la piel.",
    duracion: "20 a 30 minutos",
    precio: "$35.000",
  }
];

const Servicios = () => {
  return (
    <main className="page servicios-page container">
      <h2 className="page-title">Nuestros Servicios</h2>
      <p className="page-subtitle">
        Elige el servicio que más se adapte a ti y agenda tu cita con nuestros profesionales.
      </p>

      <div className="servicios-grid">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="servicio-card">
            <h3>{servicio.nombre}</h3>
            <p>{servicio.descripcion}</p>
            <p>
              <strong>Duración:</strong> {servicio.duracion}
            </p>
            <p>
              <strong>Precio:</strong> {servicio.precio}
            </p>
            <Link to="/citas" className="btn primary">
              Reserva Ahora
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Servicios;
