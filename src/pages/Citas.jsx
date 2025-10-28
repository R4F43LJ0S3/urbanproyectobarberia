import React, { useEffect, useState } from "react";

const Citas = () => {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    servicio: "",
    fecha: "",
    hora: "",
    notas: "",
  });
  const [citas, setCitas] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ultimaCita, setUltimaCita] = useState(null);
  const [userId, setUserId] = useState("");

  // Generar ID único para el usuario al cargar la página
  useEffect(() => {
    let storedUserId = sessionStorage.getItem("urbanBarberUserId");
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("urbanBarberUserId", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Cargar citas del usuario actual
  useEffect(() => {
    if (!userId) return;
    
    const todasLasCitas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
    const citasDelUsuario = todasLasCitas.filter(cita => cita.userId === userId);
    setCitas(citasDelUsuario);
  }, [userId]);

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

    // Crear nueva cita con userId
    const nueva = { 
      id: Date.now(), 
      userId: userId,
      ...form 
    };

    // Guardar en localStorage todas las citas
    const todasLasCitas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
    todasLasCitas.unshift(nueva);
    localStorage.setItem("citasBarberia", JSON.stringify(todasLasCitas));

    // Actualizar citas del usuario
    setCitas((prev) => [nueva, ...prev]);
    
    // Mostrar confirmación
    setUltimaCita(nueva);
    setShowConfirmation(true);

    // Reiniciar formulario
    setForm({
      nombre: "",
      telefono: "",
      servicio: "",
      fecha: "",
      hora: "",
      notas: "",
    });

    // Ocultar confirmación después de 8 segundos
    setTimeout(() => {
      setShowConfirmation(false);
    }, 8000);
  };

  const eliminarCita = (id) => {
    if (window.confirm("¿Deseas cancelar esta cita?")) {
      // Eliminar de todas las citas
      const todasLasCitas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      const citasActualizadas = todasLasCitas.filter((c) => c.id !== id);
      localStorage.setItem("citasBarberia", JSON.stringify(citasActualizadas));
      
      // Actualizar vista del usuario
      setCitas((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatearHora = (hora) => {
    const [horas, minutos] = hora.split(':');
    const h = parseInt(horas);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hora12 = h % 12 || 12;
    return `${hora12}:${minutos} ${ampm}`;
  };

  return (
    <main className="page citas-page container">
      <h2 className="page-title">Agendar una Cita</h2>
      <p className="page-subtitle">
        Completa tus datos para reservar tu servicio en Urban Barber.
      </p>

      {/* MENSAJE DE CONFIRMACIÓN */}
      {showConfirmation && ultimaCita && (
        <div style={{
          background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)',
          animation: 'slideDown 0.5s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '2rem', marginRight: '12px' }}>✅</span>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>¡Cita Confirmada!</h3>
          </div>
          <p style={{ margin: '8px 0', fontSize: '1.1rem' }}>
            <strong>{ultimaCita.nombre}</strong>, tu cita ha sido agendada exitosamente.
          </p>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '16px', 
            borderRadius: '12px',
            marginTop: '12px'
          }}>
            <p style={{ margin: '6px 0' }}><strong>📋 Servicio:</strong> {ultimaCita.servicio}</p>
            <p style={{ margin: '6px 0' }}><strong>📅 Fecha:</strong> {formatearFecha(ultimaCita.fecha)}</p>
            <p style={{ margin: '6px 0' }}><strong>🕐 Hora:</strong> {formatearHora(ultimaCita.hora)}</p>
            <p style={{ margin: '6px 0' }}><strong>📞 Teléfono:</strong> {ultimaCita.telefono}</p>
            {ultimaCita.notas && (
              <p style={{ margin: '6px 0' }}><strong>📝 Notas:</strong> {ultimaCita.notas}</p>
            )}
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '0.95rem', opacity: 0.9 }}>
            💬 Nos comunicaremos contigo para confirmar tu cita. ¡Te esperamos!
          </p>
        </div>
      )}

      <div className="citas-layout">
        {/* FORMULARIO */}
        <form className="card form" onSubmit={handleSubmit}>
          <label>
            Nombre completo *
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Juan Pérez"
            />
          </label>

          <label>
            Teléfono *
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="Ej: 300 123 4567"
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
            />
          </label>

          <label>
            Notas (opcional)
            <textarea
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              placeholder="Ej: Preferencia de barbero, estilo específico..."
              rows="3"
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              Reservar Cita
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

        {/* LISTADO DE CITAS DEL USUARIO */}
        <div className="card citas-list">
          <h3>📅 Mis Citas</h3>
          {citas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#6b6b6b' }}>
              <p style={{ fontSize: '3rem', margin: '0 0 12px' }}>📋</p>
              <p>No tienes citas registradas.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                Agenda tu primera cita completando el formulario.
              </p>
            </div>
          ) : (
            <ul>
              {citas.map((cita) => (
                <li key={cita.id}>
                  <strong>{cita.nombre}</strong> — {cita.servicio}
                  <br />
                  <small>
                    📅 {formatearFecha(cita.fecha)} | 🕐 {formatearHora(cita.hora)}
                  </small>
                  {cita.notas && (
                    <>
                      <br />
                      <small style={{ color: '#6b6b6b' }}>
                        📝 {cita.notas}
                      </small>
                    </>
                  )}
                  <div>
                    <button
                      className="btn outline"
                      onClick={() => eliminarCita(cita.id)}
                      style={{ marginTop: "8px", fontSize: "0.9rem" }}
                    >
                      Cancelar Cita
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