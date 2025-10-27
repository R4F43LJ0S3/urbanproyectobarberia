import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array de imágenes para el carrusel
  const images = [
    {
      src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=450&h=300&fit=crop",
      alt: "Barbería Urban Barber",
      caption: "Mejor valorada • Calidad"
    },
    {
      src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=450&h=300&fit=crop",
      alt: "Corte profesional",
      caption: "Estilo moderno • Profesional"
    },
    {
      src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=450&h=300&fit=crop",
      alt: "Servicio premium",
      caption: "Atención personalizada • Expertos"
    },
    {
      src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=450&h=300&fit=crop",
      alt: "Ambiente único",
      caption: "Ambiente único • Elegancia"
    }
  ];

  // Cambiar imagen automáticamente cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Función para ir a una imagen específica
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <main className="home-main">
      <section className="hero">
        <div className="hero-inner container">
          <div className="hero-text">
            <h1 className="title">Urban Barber — Estilo que habla por ti</h1>
            <p className="subtitle">
              Reserva tu cita rápido y sin complicaciones. Profesionales expertos y servicios a la medida.
            </p>
            <div className="hero-cta">
              <Link to="/citas" className="btn primary">
                Agendar cita
              </Link>
              <Link to="/servicios" className="btn outline">
                Ver servicios
              </Link>
            </div>

            <div className="features">
              <div className="feature">
                <h4>Barberos expertos</h4>
                <p>Recortes y estilo que resaltan tu personalidad.</p>
              </div>
              <div className="feature">
                <h4>Reserva online</h4>
                <p>Elige día y hora en segundos.</p>
              </div>
              <div className="feature">
                <h4>Promociones</h4>
                <p>Descuentos para clientes frecuentes.</p>
              </div>
            </div>
          </div>

          <div className="hero-media carousel-container" aria-hidden="true">
            {images.map((image, index) => (
              <div
                key={index}
                className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
              >
                <img src={image.src} alt={image.alt} />
                <div className="badge">{image.caption}</div>
              </div>
            ))}

            {/* Indicadores de puntos */}
            <div className="carousel-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about container">
        <h2>Nuestra propuesta</h2>
        <p>
          Urban Barber moderniza la experiencia de barbería: reservas rápidas, atención personalizada y control de citas.
        </p>
        <div className="about-cards">
          <article className="card">
            <h3>Ambiente profesional</h3>
            <p>Un espacio pensado para que salgas listo y con confianza.</p>
          </article>
          <article className="card">
            <h3>Productos premium</h3>
            <p>Usamos productos de calidad para cuidar tu cabello y tu piel.</p>
          </article>
          <article className="card">
            <h3>Atención al cliente</h3>
            <p>Comunicación fluida y soporte en la web (prototipo).</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Home;