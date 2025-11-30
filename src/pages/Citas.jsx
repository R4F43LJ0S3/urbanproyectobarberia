import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Citas.css";
import Cita from "../models/Citas";
import Usuario from "../models/Usuarios";

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

const Citas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);
  
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    servicio: "",
    fecha: "",
    hora: "",
    notas: "",
    barbero: "",
  });
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const user = Usuario.obtenerSesion();
    
    // ✅ REDIRIGIR SI NO HAY SESIÓN
    if (!user) {
      alert('⚠️ Debes iniciar sesión para agendar una cita');
      navigate('/login');
      return;
    }

    if (user) {
      setUsuarioActual(user);
      setForm(prev => ({
        ...prev,
        nombre: `${user.nombre} ${user.apellido}`,
        telefono: user.celular
      }));

      const todasLasCitas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      
      if (user.rol === 'admin') {
        setCitas(todasLasCitas);
      } else {
        const citasUsuario = todasLasCitas.filter(c => c.telefono === user.celular);
        setCitas(citasUsuario);
      }
    }
  }, [location.state, navigate]);

  const servicios = [
    "Corte Sencillo",
    "Corte + Cejas",
    "Corte Premium (Cejas + Perfilado de Barba)",
    "Perfilado de Barba",
    "Corte + Tinturado de Cabello",
    "Corte + Mascarilla",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ VALIDACIÓN ESTRICTA DE SESIÓN
    if (!usuarioActual) {
      alert('⚠️ Debes iniciar sesión para agendar una cita');
      navigate('/login');
      return;
    }

    if (!form.nombre || !form.telefono || !form.servicio || !form.fecha || !form.hora) {
    }

    const resultado = Cita.crearDesdeFomulario({
      nombre: form.nombre,
      telefono: form.telefono,
      servicio: form.servicio,
      fecha: form.fecha,
      hora: form.hora,
      notas: form.notas
    });

    if (!resultado.valido) {
      alert(`❌ ${resultado.mensaje}`);
      return;
    }

    resultado.cita.barbero = barberoSeleccionado?.nombre || "No especificado";

    navigate("/pago", { 
      state: { 
        cita: {
          ...form,
          id: resultado.cita.id,
          barbero: resultado.cita.barbero
        }
      } 
    });
  };

  const eliminarCita = (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      const resultado = Cita.eliminar(id);
      if (resultado.exito) {
        setCitas(prev => prev.filter(c => c.id !== id));
        alert('✅ Cita eliminada correctamente');
      } else {
        alert('❌ Error al eliminar la cita');
      }
    }
  };

  return (
    <main className="page citas-page container">
      <h2 className="page-title">Agendar una Cita</h2>
      <p className="page-subtitle">
        {usuarioActual 
          ? `¡Hola ${usuarioActual.nombre}! Agenda tu cita en Urban Barber.`
          : 'Completa tus datos para reservar tu servicio en Urban Barber.'}
      </p>

      {barberoSeleccionado && (
        <div className="barbero-seleccionado-card">
          <div className="barbero-seleccionado-content">
            <img 
              src={barberoSeleccionado.imagen} 
              alt={barberoSeleccionado.nombre}
              className="barbero-seleccionado-img"
            />
            <div className="barbero-seleccionado-info">
              <h3>✂️ Barbero seleccionado</h3>
              <p className="barbero-seleccionado-nombre">{barberoSeleccionado.nombre}</p>
              <p className="barbero-seleccionado-especialidad">{barberoSeleccionado.especialidad}</p>
            </div>
          </div>
          <button
            onClick={() => setBarberoSeleccionado(null)}
            className="btn outline"
            style={{ marginTop: '12px' }}
          >
            Cambiar barbero
          </button>
        </div>
      )}

      <div className={usuarioActual ? "citas-layout" : "citas-layout-centered"}>
        <div className="card form">
          <label>
            Nombre completo *
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              disabled={!!usuarioActual}
              style={{
                background: usuarioActual ? '#f5f5f5' : 'var(--input-bg)',
                cursor: usuarioActual ? 'not-allowed' : 'text'
              }}
            />
            {usuarioActual && (
              <small style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                Datos tomados de tu perfil
              </small>
            )}
          </label>

          <label>
            Teléfono * (Solo números)
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => {
                // ✅ CORRECCIÓN: e.target.value.replace()
                const valor = e.target.value.replace(/\D/g, '');
                
                // Mostrar notificación si intentó escribir letras
                if (e.target.value !== valor && e.target.value.length > 0) {
                  // Solo mostrar el mensaje una vez por intento
                  if (!e.target.dataset.alertShown) {
                    e.target.dataset.alertShown = 'true';
                    setTimeout(() => {
                      e.target.dataset.alertShown = '';
                    }, 2000);
                  }
                }
                
                setForm({ ...form, telefono: valor });
              }}
              maxLength="10"
              placeholder="3001234567"
              disabled={!!usuarioActual}
              style={{
                background: usuarioActual ? '#f5f5f5' : 'var(--input-bg)',
                cursor: usuarioActual ? 'not-allowed' : 'text'
              }}
            />
            <small style={{ 
              color: 'var(--muted)', 
              fontSize: '0.85rem',
              display: 'block',
              marginTop: '4px'
            }}>
              ⚠️ Solo números. Debe comenzar con 3 y tener 10 dígitos
            </small>
          </label>

          <label>
            Servicio *
            <select
              value={form.servicio}
              onChange={(e) => setForm({ ...form, servicio: e.target.value })}
            >
              <option value="">-- Selecciona un servicio --</option>
              {servicios.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label>
            Barbero
            <select
              value={form.barbero}
              onChange={(e) => {
                const barberoId = parseInt(e.target.value);
                const barbero = datosBarberos.find(b => b.id === barberoId);
                setBarberoSeleccionado(barbero || null);
                setForm({ ...form, barbero: e.target.value });
              }}
              disabled={!!barberoSeleccionado}
              style={{
                background: barberoSeleccionado ? '#f5f5f5' : 'var(--input-bg)',
                cursor: barberoSeleccionado ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">
                {barberoSeleccionado 
                  ? barberoSeleccionado.nombre 
                  : "-- Selecciona un barbero (opcional) --"}
              </option>
              {!barberoSeleccionado && datosBarberos.map((barbero) => (
                <option key={barbero.id} value={barbero.id}>
                  {barbero.nombre} - {barbero.especialidad}
                </option>
              ))}
            </select>
            {barberoSeleccionado && (
              <small style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                Ya tienes un barbero seleccionado
              </small>
            )}
          </label>

          <label>
            Fecha *
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </label>

          <label>
            Hora *
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              min="07:00"
              max="22:00"
            />
          </label>

          <label>
            Notas (opcional)
            <textarea
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              maxLength="200"
              placeholder="Máximo 200 caracteres"
            />
            <small style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              {form.notas.length}/200 caracteres
            </small>
          </label>

          <div className="form-actions">
            <button onClick={handleSubmit} className="btn primary">
              Continuar al Pago
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => {
                setForm({
                  nombre: usuarioActual ? `${usuarioActual.nombre} ${usuarioActual.apellido}` : "",
                  telefono: usuarioActual ? usuarioActual.celular : "",
                  servicio: "",
                  fecha: "",
                  hora: "",
                  notas: "",
                  barbero: "",
                });
                setBarberoSeleccionado(null);
              }}
            >
              Limpiar
            </button>
          </div>
        </div>

        {usuarioActual && (
          <div className="card citas-list">
            <h3>
              📅 {usuarioActual.rol === 'admin' 
                ? 'Todas las citas registradas' 
                : 'Mis citas registradas'}
            </h3>
            {citas.length === 0 ? (
              <p>
                {usuarioActual.rol === 'admin'
                  ? 'No hay citas registradas en el sistema.'
                  : 'No tienes citas registradas.'}
              </p>
            ) : (
              <ul>
                {citas.map((cita) => (
                  <li key={cita.id}>
                    <strong>{cita.nombre}</strong> — {cita.servicio}
                    <br />
                    <small>
                      {cita.fecha} | {cita.hora}
                    </small>
                    {cita.barbero && (
                      <small style={{ display: 'block', marginTop: '4px', color: '#d4af37' }}>
                        💈 {cita.barbero}
                      </small>
                    )}
                    {usuarioActual.rol === 'admin' && (
                      <small style={{ display: 'block', marginTop: '4px', color: 'var(--muted)' }}>
                        📞 {cita.telefono}
                      </small>
                    )}
                    {cita.pagado && (
                      <span className="badge-pagado">✓ Pagado</span>
                    )}
                    <div>
                      <button
                        className="btn outline"
                        onClick={() => eliminarCita(cita.id)}
                        style={{ marginTop: "6px" }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Citas;