class Usuario {
  constructor(nombre, apellido, correo, celular, password) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.celular = celular;
    this.password = password;
    this.fechaRegistro = new Date().toISOString();
  }

  // Validar que el nombre tenga al menos 2 caracteres
  validarNombre() {
    if (!this.nombre || this.nombre.trim().length < 2) {
      return { valido: false, mensaje: "El nombre debe tener al menos 2 caracteres" };
    }
    return { valido: true };
  }

  // Validar formato básico de correo
  validarCorreo() {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.correo || !regexCorreo.test(this.correo)) {
      return { valido: false, mensaje: "El correo electrónico no es válido" };
    }
    return { valido: true };
  }

  // Validar celular colombiano (10 dígitos)
  validarCelular() {
    const regexCelular = /^3\d{9}$/;
    if (!this.celular || !regexCelular.test(this.celular)) {
      return { valido: false, mensaje: "El celular debe tener 10 dígitos y comenzar con 3" };
    }
    return { valido: true };
  }

  // Validar contraseña mínima
  validarPassword() {
    if (!this.password || this.password.length < 4) {
      return { valido: false, mensaje: "La contraseña debe tener al menos 4 caracteres" };
    }
    return { valido: true };
  }

  // Método principal de validación
  validar() {
    const validaciones = [
      this.validarNombre(),
      this.validarCorreo(),
      this.validarCelular(),
      this.validarPassword()
    ];

    for (let validacion of validaciones) {
      if (!validacion.valido) {
        return validacion;
      }
    }

    return { valido: true, mensaje: "Usuario válido" };
  }

  // Obtener nombre completo
  getNombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  // Convertir a objeto para guardar
  toJSON() {
    return {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      celular: this.celular,
      password: this.password,
      fechaRegistro: this.fechaRegistro
    };
  }
}

export default Usuario;