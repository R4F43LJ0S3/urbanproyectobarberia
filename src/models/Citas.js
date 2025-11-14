// src/models/Citas.js
// Clase para gestionar citas

class Cita {
  constructor(id, clienteId, barberoId, servicioId, fecha, hora, notas = "") {
    this.id = id;
    this.clienteId = clienteId;
    this.barberoId = barberoId;
    this.servicioId = servicioId;
    this.fecha = fecha; // formato: YYYY-MM-DD
    this.hora = hora; // formato: HH:MM
    this.notas = notas;
    this.estado = "pendiente";
    this.pagado = false;
    this.fechaCreacion = new Date().toISOString();
  }

  // Validar que la fecha no sea pasada
  validarFecha() {
    const fechaCita = new Date(this.fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaCita < hoy) {
      return { valido: false, mensaje: "La fecha no puede ser anterior a hoy" };
    }
    return { valido: true };
  }

  // Validar formato de hora (formato 24h HH:MM)
  validarHora() {
    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!this.hora || !regexHora.test(this.hora)) {
      return { valido: false, mensaje: "La hora debe tener formato HH:MM (24h)" };
    }

    // Validar horario de atención (7:00 AM - 10:00 PM)
    const [horas] = this.hora.split(':').map(Number);
    if (horas < 7 || horas >= 22) {
      return { valido: false, mensaje: "El horario de atención es de 7:00 AM a 10:00 PM" };
    }

    return { valido: true };
  }

  // Validar que los IDs no estén vacíos
  validarIds() {
    if (!this.clienteId || !this.barberoId || !this.servicioId) {
      return { valido: false, mensaje: "Debe especificar cliente, barbero y servicio" };
    }
    return { valido: true };
  }

  // Validar notas (máximo 200 caracteres)
  validarNotas() {
    if (this.notas && this.notas.length > 200) {
      return { valido: false, mensaje: "Las notas no pueden exceder 200 caracteres" };
    }
    return { valido: true };
  }

  // Validación principal
  validar() {
    const validaciones = [
      this.validarIds(),
      this.validarFecha(),
      this.validarHora(),
      this.validarNotas()
    ];

    for (let validacion of validaciones) {
      if (!validacion.valido) {
        return validacion;
      }
    }

    return { valido: true, mensaje: "Cita válida" };
  }

  // Cambiar estado de la cita
  cambiarEstado(nuevoEstado) {
    const estadosValidos = ["pendiente", "confirmada", "cancelada", "completada"];
    if (!estadosValidos.includes(nuevoEstado)) {
      return { error: "Estado no válido" };
    }
    this.estado = nuevoEstado;
    return { exito: true, estado: this.estado };
  }

  // Marcar como pagada
  marcarComoPagada() {
    this.pagado = true;
  }

  // Verificar si la cita es próxima (dentro de las próximas 24 horas)
  esProxima() {
    const fechaHoraCita = new Date(`${this.fecha}T${this.hora}`);
    const ahora = new Date();
    const diferencia = fechaHoraCita - ahora;
    const horasHasta = diferencia / (1000 * 60 * 60);
    
    return horasHasta > 0 && horasHasta <= 24;
  }

  // ✨ NUEVO: Método estático para crear cita desde formulario
  static crearDesdeFomulario(formData) {
    const { nombre, telefono, servicio, fecha, hora, notas } = formData;

    // Validaciones básicas del formulario
    if (!nombre || nombre.trim().length < 2) {
      return {
        valido: false,
        mensaje: "El nombre debe tener al menos 2 caracteres"
      };
    }

    if (!telefono || telefono.length !== 10) {
      return {
        valido: false,
        mensaje: "El teléfono debe tener 10 dígitos"
      };
    }

    if (!servicio) {
      return {
        valido: false,
        mensaje: "Debes seleccionar un servicio"
      };
    }

    if (!fecha) {
      return {
        valido: false,
        mensaje: "Debes seleccionar una fecha"
      };
    }

    if (!hora) {
      return {
        valido: false,
        mensaje: "Debes seleccionar una hora"
      };
    }

    // Crear instancia de la cita
    const cita = new Cita(
      Date.now(),
      telefono, // Usamos el teléfono como clienteId
      "barbero_default", // Por ahora un barbero por defecto
      servicio,
      fecha,
      hora,
      notas || ""
    );

    // Agregar datos adicionales del formulario
    cita.nombre = nombre;
    cita.telefono = telefono;
    cita.servicio = servicio;

    // Validar la cita completa
    const validacion = cita.validar();
    if (!validacion.valido) {
      return validacion;
    }

    return {
      valido: true,
      mensaje: "Cita creada exitosamente",
      cita: cita
    };
  }

  // ✨ NUEVO: Guardar cita en localStorage
  guardar() {
    try {
      const citas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      citas.unshift(this.toJSON());
      localStorage.setItem("citasBarberia", JSON.stringify(citas));
      return { exito: true, mensaje: "Cita guardada exitosamente" };
    } catch (error) {
      return { exito: false, mensaje: "Error al guardar la cita" };
    }
  }

  // ✨ NUEVO: Método estático para eliminar cita
  static eliminar(id) {
    try {
      const citas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      const citasActualizadas = citas.filter(c => c.id !== id);
      localStorage.setItem("citasBarberia", JSON.stringify(citasActualizadas));
      return { exito: true, mensaje: "Cita eliminada exitosamente" };
    } catch (error) {
      return { exito: false, mensaje: "Error al eliminar la cita" };
    }
  }

  toJSON() {
    return {
      id: this.id,
      clienteId: this.clienteId,
      barberoId: this.barberoId,
      servicioId: this.servicioId,
      fecha: this.fecha,
      hora: this.hora,
      notas: this.notas,
      estado: this.estado,
      pagado: this.pagado,
      fechaCreacion: this.fechaCreacion,
      // Campos adicionales del formulario
      nombre: this.nombre,
      telefono: this.telefono,
      servicio: this.servicio
    };
  }
}

export default Cita;