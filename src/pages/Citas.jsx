import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Citas.css";
import Cita from "../models/Citas";

const Citas = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    servicio: "",
    fecha: "",
    hora: "",
    notas: "",
  });
  const [citas, setCitas] = useState([]);

  // Cargar citas almacenadas al iniciar
  useEffect(() => {
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

  // 🎯 REFACTORIZADO: Usar método estático de la clase Cita
  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear y validar cita usando la clase
    const resultado = Cita.crearDesdeFomulario(form);

    if (!resultado.valido) {
      alert(`❌ ${resultado.mensaje}`);
      return;
    }

    // Redirigir a la página de pagos con la cita validada
    navigate("/pago", { 
      state: { 
        cita: resultado.cita.toJSON()
      } 
    });
  };

  // 🎯 REFACTORIZADO: Usar método estático para eliminar
  const eliminarCita = (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      const resultado = Cita.eliminar(id);
      if (resultado.exito) {
        setCitas(prev => prev.filter(c => c.id !== id));
      } else {
        alert(`❌ ${resultado.mensaje}`);
      }
    }
  };

  return (
    <main className="page citas-page container">
      <h2 className="page-title">Agendar una Cita</h2>
      <p className="page-subtitle">
        Completa tus datos para reservar tu servicio en Urban Barber.
      </p>

      <div className="citas-layout">
        {/* FORMULARIO */}
        <form className="card form" onSubmit={handleSubmit}>
          <label>
            Nombre completo *
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </label>

          <label>
            Teléfono *
            <input
              type="text"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              maxLength="10"
              placeholder="3001234567"
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
            <button type="submit" className="btn primary">
              Continuar al Pago
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() =>
                setForm({
                  nombre: "",
                  telefono: "",
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
        </form>

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