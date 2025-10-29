import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      {/* SECCIÓN DE MAPA */}
      <div className="footer-map-section">
        <div className="container">
          <h3 className="map-title">📍 Encuéntranos</h3>
          <p className="map-subtitle">Calle 10 #25-45, Valledupar, Colombia</p>
          
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62691.89537644688!2d-73.28344687832031!3d10.463664299999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e8ab9fd6d8b5c5d%3A0x7f5b8c8c8c8c8c8c!2sValledupar%2C%20Cesar%2C%20Colombia!5e0!3m2!1ses!2sco!4v1234567890123"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "16px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Urban Barber"
            ></iframe>
          </div>
          
          <div className="map-info">
            <div className="map-info-item">
              <span className="info-icon">📞</span>
              <div>
                <strong>Teléfono</strong>
                <p>300 456 7890</p>
              </div>
            </div>
            <div className="map-info-item">
              <span className="info-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>contacto@urbanbarber.com</p>
              </div>
            </div>
            <div className="map-info-item">
              <span className="info-icon">🕐</span>
              <div>
                <strong>Horario</strong>
                <p>Lun - Dom: 9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN ORIGINAL DEL FOOTER */}
      <div className="footer-container container">
        <div className="footer-info">
          <h3>UrbanBarber.</h3>
          <p>
            Tu barbería moderna en Valledupar.  
            Estilo, precisión y atención personalizada.
          </p>
        </div>

        <div className="footer-links">
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/citas">Citas</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://wa.me/573004567890" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} UrbanBarber. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;