class Servicio {
  constructor(id, nombre, descripcion, duracion, precio) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.duracion = duracion; // en minutos
    this.precio = precio; // en pesos colombianos
    this.disponible = true;
    this.popularidad = 0; // contador de veces que se ha solicitado
  }

  // Validar nombre del servicio
  validarNombre() {
    if (!this.nombre || this.nombre.trim().length < 5) {
      return { valido: false, mensaje: "El nombre debe tener al menos 5 caracteres" };
    }
    return { valido: true };
  }

  // Validar descripción
  validarDescripcion() {
    if (!this.descripcion || this.descripcion.trim().length < 10) {
      return { valido: false, mensaje: "La descripción debe tener al menos 10 caracteres" };
    }
    return { valido: true };
  }

  // Validar duración (debe ser entre 15 y 120 minutos)
  validarDuracion() {
    if (!this.duracion || this.duracion < 15 || this.duracion > 120) {
      return { valido: false, mensaje: "La duración debe estar entre 15 y 120 minutos" };
    }
    return { valido: true };
  }

  // Validar precio (debe ser mayor a 10000 y menor a 100000)
  validarPrecio() {
    if (!this.precio || this.precio < 10000 || this.precio > 100000) {
      return { valido: false, mensaje: "El precio debe estar entre $10,000 y $100,000" };
    }
    return { valido: true };
  }

  // Validación principal
  validar() {
    const validaciones = [
      this.validarNombre(),
      this.validarDescripcion(),
      this.validarDuracion(),
      this.validarPrecio()
    ];

    for (let validacion of validaciones) {
      if (!validacion.valido) {
        return validacion;
      }
    }

    return { valido: true, mensaje: "Servicio válido" };
  }

  // Incrementar popularidad
  incrementarPopularidad() {
    this.popularidad++;
  }

  // Aplicar descuento
  aplicarDescuento(porcentaje) {
    if (porcentaje < 0 || porcentaje > 100) {
      return { error: "El descuento debe estar entre 0 y 100%" };
    }
    const descuento = this.precio * (porcentaje / 100);
    return {
      precioOriginal: this.precio,
      descuento: descuento,
      precioFinal: this.precio - descuento
    };
  }

  // Obtener precio formateado
  getPrecioFormateado() {
    return `$${this.precio.toLocaleString('es-CO')}`;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      duracion: this.duracion,
      precio: this.precio,
      disponible: this.disponible,
      popularidad: this.popularidad
    };
  }
}

export default Servicio;