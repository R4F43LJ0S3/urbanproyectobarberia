import React from "react";
import { Link } from "react-router-dom";

const servicios = [
  {
    id: 1,
    nombre: "Corte de Cabello",
    descripcion: "Corte moderno o clásico con acabado profesional y personalizado.",
    duracion: "40 a 60 minutos",
    precio: "$25.000",
  },
  {
    id: 2,
    nombre: "Corte de Cabello para Niño",
    descripcion: "Cortes frescos y divertidos en un ambiente cómodo para los pequeños.",
    duracion: "40 a 60 minutos",
    precio: "$25.000",
  },
  {
    id: 3,
    nombre: "Tratamiento  Reparador Anticaida",
    descripcion: "Fortalece el cabello, reduce la caída y estimula el crecimiento.",
    duracion: "20 a 30 minutos",
    precio: "$40.000",
  },
  {
    id: 4,
    nombre: "Rapado",
    descripcion: "Look limpio y preciso con acabado al ras profesional.",
    duracion: "15 a 20 minutos",
    precio: "$15.000",
  },
  {
    id: 5,
    nombre: "Afeitado de Cabeza",
    descripcion: "Afeitado al ras con navaja y productos que cuidan tu piel.",
    duracion: "30 a 40 minutos",
    precio: "$20.000",
  },
  {
    id: 6,
    nombre: "Alizado de Cabello",
    descripcion: "Cabello suave, liso y con brillo por más tiempo.",
    duracion: "20 a 30 minutos",
    precio: "$35.000",
  },
  {
    id: 7,
    nombre: "Arreglo de Barba",
    descripcion: "Dale forma y estilo a tu barba con un acabado limpio y definido.",
    duracion: "20 a 30 minutos",
    precio: "$25.000",
  },
  {
    id: 8,
    nombre: "Perfilado de Barba",
    descripcion: "Definición precisa para realzar el contorno y estilo de tu barba.",
    duracion: "15 a 20 minutos",
    precio: "$25.000",
  },
  {
    id: 9,
    nombre: "Afeitado de Barba",
    descripcion: "Afeitado clásico con toalla caliente y productos hidratantes.",
    duracion: "20 a 25 minutos",
    precio: "$20.000",
  },
  {
     id: 10,
    nombre: "Tintura de Barba",
    descripcion: "Color uniforme y natural que resalta tu look.",
    duracion: "30 a 40 minutos",
    precio: "$50.000",
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
