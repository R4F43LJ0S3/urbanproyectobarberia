import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Barberos.css';
import { Scissors, Award, Star } from 'lucide-react';

const datosBarberos = [
  { 
    id: 1, 
    nombre: "Ricardo 'El Clásico'", 
    especialidad: "Cortes Tradicionales",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGgCV2KT2zpjkPN9_5ONLMvOLLYHG8GEEgDw&s",
    experiencia: "10 años",
    rating: 4.9
  },
  { 
    id: 2, 
    nombre: "Rafael 'El Diseñador'", 
    especialidad: "Diseños y Fade Modernos",
    imagen: "https://i.ytimg.com/vi/cr1aUuAbhPo/maxresdefault.jpg",
    experiencia: "8 años",
    rating: 4.8
  },
  { 
    id: 3, 
    nombre: "Juan 'El Lápiz'", 
    especialidad: "Afeitado con Navaja y Patillas",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCv5o6aAYemBL-7g4hC1V3v1JFICXqZRnPow&s",
    experiencia: "12 años",
    rating: 5.0
  }
];

const Barberos = () => {
  return (
    <div className="barberos-page">
      <div className="barberos-container">
        
        {/* HEADER */}
        <div className="barberos-header">
          <div className="barberos-header-icons">
            <Scissors size={40} color="#d4af37" strokeWidth={2} />
            <h1 className="barberos-titulo">
              Nuestros Barberos Expertos
            </h1>
            <Scissors 
              size={40} 
              color="#d4af37" 
              strokeWidth={2} 
              style={{ transform: 'scaleX(-1)' }} 
            />
          </div>
          <p className="barberos-descripcion">
            Conoce al equipo que hará que tu estilo destaque con profesionalismo y pasión
          </p>
        </div>

        {/* GRID DE BARBEROS */}
        <div className="barberos-grid">
          {datosBarberos.map(barbero => (
            <div key={barbero.id} className="barbero-card">
              
              {/* IMAGEN */}
              <div className="barbero-imagen-container">
                <div className="barbero-imagen-wrapper">
                  <img 
                    src={barbero.imagen} 
                    alt={`Foto de ${barbero.nombre}`}
                    className="barbero-imagen"
                  />
                  <div className="barbero-badge">
                    <Award size={20} color="#1a1a1a" />
                  </div>
                </div>
              </div>

              {/* NOMBRE */}
              <h2 className="barbero-nombre">{barbero.nombre}</h2>

              {/* ESPECIALIDAD */}
              <p className="barbero-especialidad">{barbero.especialidad}</p>

              {/* INFO ADICIONAL */}
              <div className="barbero-info">
                <div className="barbero-info-item">
                  <p className="barbero-info-label">Experiencia</p>
                  <p className="barbero-info-value">{barbero.experiencia}</p>
                </div>
                <div className="barbero-info-item">
                  <p className="barbero-info-label">Rating</p>
                  <div className="barbero-rating">
                    <Star size={16} fill="#d4af37" color="#d4af37" />
                    <span className="barbero-rating-value">{barbero.rating}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* CALL TO ACTION */}
        <div className="barberos-cta">
          <Link to="/citas">
            <button className="barberos-cta-button">
              Agenda tu Cita Ahora
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Barberos;