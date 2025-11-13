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