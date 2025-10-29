import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // Guardar automáticamente al cambiar citas
  useEffect(() => {
    localStorage.setItem("citasBarberia", JSON.stringify(citas));
  }, [citas]);

  const servicios = [
    "Corte de Cabello",
    "Corte de Cabello para Niños",
    "Tratamiento Reparador Anticaida",
    "Rapado",
    "Afeitado de Cabeza",
    "Alizado de Cabello",
    "Arreglo de Barba",
    "Perfilado de Barba",
    "Afeitado de Barba",
    "Tintura de Barba",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (
      !form.nombre ||
      !form.telefono ||
      !form.servicio ||
      !form.fecha ||
      !form.hora
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Redirigir a la página de pago con los datos de la cita
    navigate("/pago", { state: { cita: form } });
  };

  const eliminarCita = (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      setCitas((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <main className="page citas-page container">
      <h2 className="page-title">Agendar una Cita</h2>
      <p className="page-subtitle">
        Completa tus datos y procede al pago para confirmar tu reserva en Urban Barber.
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
            />
          </label>

          <label>
            Hora *
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
            />
          </label>

          <label>
            Notas (opcional)
            <textarea
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              Continuar al pago
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
                    <span className="badge-pagado">✅ Pagado</span>
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