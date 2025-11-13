class Barbero {
  constructor(id, nombre, especialidad, experiencia, imagen = "", rating = 5.0) {
    this.id = id;
    this.nombre = nombre;
    this.especialidad = especialidad;
    this.experiencia = experiencia; // "5 años", "10 años"
    this.imagen = imagen;
    this.rating = rating;
    this.disponible = true;
    this.citasAtendidas = 0;
  }

  // Validar nombre del barbero
  validarNombre() {
    if (!this.nombre || this.nombre.trim().length < 3) {
      return { valido: false, mensaje: "El nombre debe tener al menos 3 caracteres" };
    }
    return { valido: true };
  }

  // Validar especialidad
  validarEspecialidad() {
    const especialidadesValidas = [
      "Cortes Tradicionales",
      "Diseños y Fade Modernos",
      "Afeitado con Navaja y Patillas",
      "Cortes Premium",
      "Tinturado"
    ];

    if (!this.especialidad || !especialidadesValidas.includes(this.especialidad)) {
      return { valido: false, mensaje: "La especialidad no es válida" };
    }
    return { valido: true };
  }

  // Validar experiencia (debe tener formato "X años")
  validarExperiencia() {
    const regexExperiencia = /^\d+\s+(año|años)$/i;
    if (!this.experiencia || !regexExperiencia.test(this.experiencia)) {
      return { valido: false, mensaje: "La experiencia debe tener formato: '5 años' o '10 años'" };
    }
    return { valido: true };
  }

  // Validar rating (debe estar entre 1 y 5)
  validarRating() {
    if (this.rating < 1 || this.rating > 5) {
      return { valido: false, mensaje: "El rating debe estar entre 1 y 5" };
    }
    return { valido: true };
  }

  // Validación principal
  validar() {
    const validaciones = [
      this.validarNombre(),
      this.validarEspecialidad(),
      this.validarExperiencia(),
      this.validarRating()
    ];

    for (let validacion of validaciones) {
      if (!validacion.valido) {
        return validacion;
      }
    }

    return { valido: true, mensaje: "Barbero válido" };
  }

  // Incrementar contador de citas atendidas
  atenderCita() {
    this.citasAtendidas++;
  }

  // Cambiar disponibilidad
  cambiarDisponibilidad(disponible) {
    this.disponible = disponible;
  }

  // Obtener años de experiencia como número
  getAniosExperiencia() {
    const match = this.experiencia.match(/^\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      especialidad: this.especialidad,
      experiencia: this.experiencia,
      imagen: this.imagen,
      rating: this.rating,
      disponible: this.disponible,
      citasAtendidas: this.citasAtendidas
    };
  }
}

export default Barbero;