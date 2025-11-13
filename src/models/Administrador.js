import Usuario from './Usuarios.js';

class Administrador extends Usuario {
  constructor(nombre, apellido, correo, celular, password, nivelAcceso = "admin") {
    super(nombre, apellido, correo, celular, password);
    this.tipo = "administrador";
    this.nivelAcceso = nivelAcceso; // "admin" o "superadmin"
    this.permisos = this.asignarPermisos();
  }

  // Asignar permisos según nivel de acceso
  asignarPermisos() {
    if (this.nivelAcceso === "superadmin") {
      return {
        gestionarUsuarios: true,
        gestionarCitas: true,
        gestionarBarberos: true,
        verReportes: true,
        configurarSistema: true
      };
    }
    return {
      gestionarUsuarios: false,
      gestionarCitas: true,
      gestionarBarberos: true,
      verReportes: true,
      configurarSistema: false
    };
  }

  // Validar nivel de acceso
  validarNivelAcceso() {
    const nivelesValidos = ["admin", "superadmin"];
    if (!nivelesValidos.includes(this.nivelAcceso)) {
      return { valido: false, mensaje: "Nivel de acceso no válido" };
    }
    return { valido: true };
  }

  // Sobrescribir validación
  validar() {
    const validacionBase = super.validar();
    if (!validacionBase.valido) {
      return validacionBase;
    }

    return this.validarNivelAcceso();
  }

  // Verificar si tiene un permiso específico
  tienePermiso(permiso) {
    return this.permisos[permiso] === true;
  }

  // Método para gestionar citas (ejemplo de funcionalidad admin)
  puedeGestionarCitas() {
    return this.tienePermiso('gestionarCitas');
  }

  toJSON() {
    return {
      ...super.toJSON(),
      tipo: this.tipo,
      nivelAcceso: this.nivelAcceso,
      permisos: this.permisos
    };
  }
}

export default Administrador;