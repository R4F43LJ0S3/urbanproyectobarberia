class Pago {
  constructor(id, citaId, monto, metodoPago, tipo = "completo") {
    this.id = id;
    this.citaId = citaId;
    this.monto = monto;
    this.metodoPago = metodoPago; // "nequi", "efectivo", "tarjeta"
    this.tipo = tipo; // "completo" o "deposito" (50%)
    this.estado = "pendiente"; // pendiente, procesando, completado, fallido
    this.fechaPago = null;
    this.fechaCreacion = new Date().toISOString();
    this.transaccionId = this.generarTransaccionId();
  }

  // Generar ID único de transacción
  generarTransaccionId() {
    return `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  // Validar monto (debe ser mayor a 0 y menor a 200000)
  validarMonto() {
    if (!this.monto || this.monto <= 0) {
      return { valido: false, mensaje: "El monto debe ser mayor a 0" };
    }
    if (this.monto > 200000) {
      return { valido: false, mensaje: "El monto no puede exceder $200,000" };
    }
    return { valido: true };
  }

  // Validar método de pago
  validarMetodoPago() {
    const metodosValidos = ["nequi", "efectivo", "tarjeta"];
    if (!this.metodoPago || !metodosValidos.includes(this.metodoPago)) {
      return { valido: false, mensaje: "Método de pago no válido" };
    }
    return { valido: true };
  }

  // Validar tipo de pago
  validarTipo() {
    const tiposValidos = ["completo", "deposito"];
    if (!this.tipo || !tiposValidos.includes(this.tipo)) {
      return { valido: false, mensaje: "Tipo de pago no válido" };
    }
    return { valido: true };
  }

  // Validar que existe la cita asociada
  validarCita() {
    if (!this.citaId) {
      return { valido: false, mensaje: "Debe especificar una cita" };
    }
    return { valido: true };
  }

  // Validación principal
  validar() {
    const validaciones = [
      this.validarCita(),
      this.validarMonto(),
      this.validarMetodoPago(),
      this.validarTipo()
    ];

    for (let validacion of validaciones) {
      if (!validacion.valido) {
        return validacion;
      }
    }

    return { valido: true, mensaje: "Pago válido" };
  }

  // Procesar el pago
  procesarPago() {
    this.estado = "procesando";
    
    // Simulación de procesamiento
    return new Promise((resolve) => {
      setTimeout(() => {
        this.estado = "completado";
        this.fechaPago = new Date().toISOString();
        resolve({
          exito: true,
          mensaje: "Pago procesado exitosamente",
          transaccionId: this.transaccionId
        });
      }, 2000);
    });
  }

  // Cancelar pago
  cancelarPago() {
    if (this.estado === "completado") {
      return { error: "No se puede cancelar un pago completado" };
    }
    this.estado = "fallido";
    return { exito: true, mensaje: "Pago cancelado" };
  }

  // Calcular monto restante si es depósito
  calcularMontoRestante(precioTotal) {
    if (this.tipo === "deposito") {
      return precioTotal - this.monto;
    }
    return 0;
  }

  // Obtener monto formateado
  getMontoFormateado() {
    return `$${this.monto.toLocaleString('es-CO')}`;
  }

  toJSON() {
    return {
      id: this.id,
      citaId: this.citaId,
      monto: this.monto,
      metodoPago: this.metodoPago,
      tipo: this.tipo,
      estado: this.estado,
      fechaPago: this.fechaPago,
      fechaCreacion: this.fechaCreacion,
      transaccionId: this.transaccionId
    };
  }
}

export default Pago;