import React, { useState } from "react";

const Contacto = () => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.correo || !form.mensaje) {
      alert("Por favor completa todos los campos.");
      return;
    }

    alert("📨 Tu mensaje ha sido enviado correctamente (simulación).");
    setForm({ nombre: "", correo: "", mensaje: "" });
  };

  return (
    <main className="page contacto-page container">
      <h2 className="page-title">Contáctanos</h2>
      <p className="page-subtitle">
        Si tienes dudas, sugerencias o deseas más información sobre nuestros servicios,
        completa el siguiente formulario.
      </p>

      <form className="card contacto-form" onSubmit={handleSubmit}>
        <label>
          Nombre completo *
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </label>

        <label>
          Correo electrónico *
          <input
            type="email"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
          />
        </label>

        <label>
          Mensaje *
          <textarea
            rows="5"
            value={form.mensaje}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          />
        </label>

        <button type="submit" className="btn primary">
          Enviar mensaje
        </button>
      </form>

      <section className="info-contacto">
        <h3>📍 Información de contacto</h3>
        <p>📞 Teléfono: 300 456 7890</p>
        <p>📧 Email: contacto@urbanbarber.com</p>
        <p>🏠 Dirección: Calle 10 #25-45, Valledupar, Colombia</p>
        <p>🕐 Horario: Lunes a Sábado — 9:00 a.m. a 7:00 p.m.</p>
      </section>
    </main>
  );
};

export default Contacto;
