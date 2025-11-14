import Usuario from './Usuarios.js';

class Cliente extends Usuario {
  constructor(nombre, apellido, correo, celular, password, direccion = "") {
    super(nombre, apellido, correo, celular, password);
    this.direccion = direccion;
    this.tipo = "cliente";
    this.citasAgendadas = [];
    this.puntosFidelidad = 0;
  }

  // Validar dirección (opcional pero si existe, mínimo 5 caracteres)
  validarDireccion() {
    if (this.direccion && this.direccion.trim().length < 5) {
      return { valido: false, mensaje: "La dirección debe tener al menos 5 caracteres" };
    }
    return { valido: true };
  }

  // Sobrescribir validación para incluir dirección
  validar() {
    const validacionBase = super.validar();
    if (!validacionBase.valido) {
      return validacionBase;
    }
    return this.validarDireccion();
  }

  // Agregar cita al historial
  agregarCita(citaId) {
    this.citasAgendadas.push(citaId);
    this.puntosFidelidad += 10; // 10 puntos por cada cita
  }

  // Obtener total de citas
  getTotalCitas() {
    return this.citasAgendadas.length;
  }

  // Verificar si es cliente frecuente (más de 5 citas)
  esClienteFrecuente() {
    return this.citasAgendadas.length >= 5;
  }

  // ✨ NUEVO: Método estático para registrar/autenticar cliente
  static autenticarORegistrar(datosCliente) {
    const { nombre, apellido, correo, celular } = datosCliente;

    // Crear instancia del cliente
    const cliente = new Cliente(
      nombre,
      apellido,
      correo,
      celular,
      "temp123", // Password temporal
      ""
    );

    // Validar datos básicos
    if (!nombre || nombre.trim().length < 2) {
      return {
        exito: false,
        mensaje: "El nombre debe tener al menos 2 caracteres"
      };
    }

    if (!celular || celular.length !== 10 || !celular.startsWith('3')) {
      return {
        exito: false,
        mensaje: "El celular debe tener 10 dígitos y comenzar con 3"
      };
    }

    if (!correo || !correo.includes('@')) {
      return {
        exito: false,
        mensaje: "Ingresa un correo válido"
      };
    }

    return {
      exito: true,
      mensaje: "Cliente autenticado correctamente",
      cliente: cliente
    };
  }

  // ✨ NUEVO: Obtener citas del cliente desde localStorage
  obtenerMisCitas() {
    try {
      const todasLasCitas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      return todasLasCitas.filter(cita => cita.telefono === this.celular);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      return [];
    }
  }

  // ✨ NUEVO: Agrupar citas por fecha
  agruparCitasPorFecha(citas) {
    const citasPorFecha = citas.reduce((acc, cita) => {
      const fecha = cita.fecha;
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(cita);
      return acc;
    }, {});

    // Ordenar fechas
    const fechasOrdenadas = Object.keys(citasPorFecha).sort((a, b) => 
      new Date(a) - new Date(b)
    );

    return { citasPorFecha, fechasOrdenadas };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      direccion: this.direccion,
      tipo: this.tipo,
      citasAgendadas: this.citasAgendadas,
      puntosFidelidad: this.puntosFidelidad
    };
  }
}

export default Cliente;