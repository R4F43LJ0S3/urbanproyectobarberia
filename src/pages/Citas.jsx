import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Citas.css";
import Cita from "../models/Citas";
import Usuario from "../models/Usuarios";

const Citas = () => {
  const navigate = useNavigate();
  const [usuarioActual, setUsuarioActual] = useState(null);
  
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    servicio: "",
    fecha: "",
    hora: "",
    notas: "",
  });
  const [citas, setCitas] = useState([]);

  // Cargar usuario y citas al iniciar
  useEffect(() => {
    // Verificar si hay sesión activa
    const user = Usuario.obtenerSesion();
    if (user) {
      setUsuarioActual(user);
      // Pre-llenar el formulario con datos del usuario
      setForm(prev => ({
        ...prev,
        nombre: `${user.nombre} ${user.apellido}`,
        telefono: user.celular
      }));
    }

    // Cargar citas
    const stored = localStorage.getItem("citasBarberia");
    if (stored) {
      setCitas(JSON.parse(stored));
    }
  }, []);

  const servicios = [
    "Corte Sencillo",
    "Corte + Cejas",
    "Corte Premium (Cejas + Perfilado de Barba)",
    "Perfilado de Barba",
    "Corte + Tinturado de Cabello",
    "Corte + Mascarilla",
  ];

  // Crear cita
  const handleSubmit = (e) => {
    e.preventDefault();

    // Si no hay usuario logueado, mostrar mensaje
    if (!usuarioActual) {
      const continuar = window.confirm(
        '⚠️ No has iniciado sesión.\n\n' +
        '¿Deseas continuar sin cuenta? (No podrás ver tu historial de citas)\n\n' +
        'Presiona "Aceptar" para continuar o "Cancelar" para iniciar sesión.'
      );
      
      if (!continuar) {
        navigate('/login');
        return;
      }
    }

    // Crear y validar cita
    const resultado = Cita.crearDesdeFomulario(form);

    if (!resultado.valido) {
      alert(`❌ ${resultado.mensaje}`);
      return;
    }

    // Redirigir al pago
    navigate("/pago", { 
      state: { 
        cita: resultado.cita.toJSON()
      } 
    });
  };

  // Eliminar cita
  const eliminarCita = (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      const resultado = Cita.eliminar(id);
      if (resultado.exito) {
        setCitas(prev => prev.filter(c => c.id !== id));
        alert('✅ Cita eliminada correctamente');
      } else {
        alert(`❌ ${resultado.mensaje}`);
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

      {/* ALERTA DE USUARIO */}
      {!usuarioActual && (
        <div style={{
          background: 'linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)',
          border: '2px solid #ffd966',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#666' }}>
            💡 <strong>¿Tienes cuenta?</strong> 
            <button
              onClick={() => navigate('/login')}
              style={{
                marginLeft: '8px',
                background: '#c59a2f',
                color: 'white',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Iniciar Sesión
            </button>
          </p>
          <p style={{ margin: '8px 0 0', color: '#999', fontSize: '0.9rem' }}>
            Inicia sesión para ver tu historial de citas
          </p>
        </div>
      )}

      <div className="citas-layout">
        {/* FORMULARIO */}
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
            Teléfono *
            <input
              type="text"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              maxLength="10"
              placeholder="3001234567"
              disabled={!!usuarioActual}
              style={{
                background: usuarioActual ? '#f5f5f5' : 'var(--input-bg)',
                cursor: usuarioActual ? 'not-allowed' : 'text'
              }}
            />
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
              onClick={() =>
                setForm({
                  nombre: usuarioActual ? `${usuarioActual.nombre} ${usuarioActual.apellido}` : "",
                  telefono: usuarioActual ? usuarioActual.celular : "",
                  servicio: "",
                  fecha: "",
                  hora: "",
                  notas: "",
                })
              }
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* LISTADO DE CITAS */}
        <div className="card citas-list">
          <h3>📅 Citas registradas</h3>
          {citas.length === 0 ? (
            <p>No hay citas registradas.</p>
          ) : (
            <ul>
              {citas.map((cita) => (
                <li key={cita.id}>
                  <strong>{cita.nombre}</strong> — {cita.servicio}
                  <br />
                  <small>
                    {cita.fecha} | {cita.hora}
                  </small>
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
      </div>
    </main>
  );
};

export default Citas;