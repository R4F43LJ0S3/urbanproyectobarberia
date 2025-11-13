class HorarioBarbero {
  constructor(id, barberoId, diaSemana, horaInicio, horaFin, disponible = true) {
    this.id = id;
    this.barberoId = barberoId;
    this.diaSemana = diaSemana; // 0=Domingo, 1=Lunes, ..., 6=Sábado
    this.horaInicio = horaInicio; // formato HH:MM
    this.horaFin = horaFin; // formato HH:MM
    this.disponible = disponible;
    this.bloqueosTemporales = []; // fechas específicas bloqueadas
  }

  // Validar día de la semana
  validarDiaSemana() {
    if (this.diaSemana < 0 || this.diaSemana > 6) {
      return { valido: false, mensaje: "El día debe estar entre 0 (Domingo) y 6 (Sábado)" };
    }
    return { valido: true };
  }

  // Validar formato de hora
  validarFormatoHora(hora) {
    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regexHora.test(hora);
  }

  // Validar hora de inicio
  validarHoraInicio() {
    if (!this.horaInicio || !this.validarFormatoHora(this.horaInicio)) {
      return { valido: false, mensaje: "Hora de inicio no válida (formato HH:MM)" };
    }
    return { valido: true };
  }

  // Validar hora de fin
  validarHoraFin() {
    if (!this.horaFin || !this.validarFormatoHora(this.horaFin)) {
      return { valido: false, mensaje: "Hora de fin no válida (formato HH:MM)" };
    }

    // Validar que hora fin sea después de hora inicio
    const [horaI, minI] = this.horaInicio.split(':').map(Number);
    const [horaF, minF] = this.horaFin.split(':').map(Number);
    
    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;

    if (minutosFin <= minutosInicio) {
      return { valido: false, mensaje: "La hora de fin debe ser posterior a la hora de inicio" };
    }

    return { valido: true };
  }

  // Validar barbero ID
  validarBarbero() {
    if (!this.barberoId) {
      return { valido: false, mensaje: "Debe especificar un barbero" };
    }
    return { valido: true };
  }

  // Validación principal
  validar() {
    const validaciones = [
      this.validarBarbero(),
      this.validarDiaSemana(),
      this.validarHoraInicio(),
      this.validarHoraFin()
    ];

    for (let validacion of validaciones) {
      if (!validacion.valido) {
        return validacion;
      }
    }

    return { valido: true, mensaje: "Horario válido" };
  }

  // Bloquear una fecha específica
  bloquearFecha(fecha) {
    if (!this.bloqueosTemporales.includes(fecha)) {
      this.bloqueosTemporales.push(fecha);
      return { exito: true, mensaje: `Fecha ${fecha} bloqueada` };
    }
    return { error: "La fecha ya está bloqueada" };
  }

  // Desbloquear una fecha
  desbloquearFecha(fecha) {
    const index = this.bloqueosTemporales.indexOf(fecha);
    if (index > -1) {
      this.bloqueosTemporales.splice(index, 1);
      return { exito: true, mensaje: `Fecha ${fecha} desbloqueada` };
    }
    return { error: "La fecha no estaba bloqueada" };
  }

  // Verificar si una fecha específica está disponible
  estaDisponible(fecha) {
    if (!this.disponible) return false;
    return !this.bloqueosTemporales.includes(fecha);
  }

  // Obtener duración del turno en horas
  getDuracionTurno() {
    const [horaI, minI] = this.horaInicio.split(':').map(Number);
    const [horaF, minF] = this.horaFin.split(':').map(Number);
    
    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;
    
    return (minutosFin - minutosInicio) / 60;
  }

  // Obtener nombre del día
  getNombreDia() {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[this.diaSemana];
  }

  toJSON() {
    return {
      id: this.id,
      barberoId: this.barberoId,
      diaSemana: this.diaSemana,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      disponible: this.disponible,
      bloqueosTemporales: this.bloqueosTemporales
    };
  }
}

export default HorarioBarbero;