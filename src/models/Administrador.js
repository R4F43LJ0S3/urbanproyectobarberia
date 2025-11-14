// src/models/Administrador.js
// Clase Administrador que hereda de Usuario

import Usuario from './Usuarios.js';

class Administrador extends Usuario {
  constructor(nombre, apellido, correo, celular, password, nivelAcceso = "admin") {
    super(nombre, apellido, correo, celular, password);
    this.tipo = "administrador";
    this.nivelAcceso = nivelAcceso;
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

  // Método para gestionar citas
  puedeGestionarCitas() {
    return this.tienePermiso('gestionarCitas');
  }

  // ✨ NUEVO: Método estático para autenticar administrador
  static autenticar(usuario, password) {
    // Credenciales por defecto del sistema
    const adminDefecto = {
      usuario: "admin",
      password: "1234"
    };

    if (usuario === adminDefecto.usuario && password === adminDefecto.password) {
      // Crear instancia del admin autenticado
      const admin = new Administrador(
        "Administrador",
        "Sistema",
        "admin@urbanbarber.com",
        "3001234567",
        adminDefecto.password,
        "superadmin"
      );
      return {
        exito: true,
        mensaje: "Autenticación exitosa",
        admin: admin
      };
    }

    return {
      exito: false,
      mensaje: "Usuario o contraseña incorrectos"
    };
  }

  // ✨ NUEVO: Obtener estadísticas de citas
  obtenerEstadisticas(citas) {
    const ahora = new Date();
    
    // Total de citas
    const totalCitas = citas.length;
    
    // Citas futuras ordenadas
    const citasFuturas = citas.filter(cita => {
      const fechaCita = new Date(cita.fecha + 'T' + cita.hora);
      return fechaCita > ahora;
    }).sort((a, b) => {
      const fechaA = new Date(a.fecha + 'T' + a.hora);
      const fechaB = new Date(b.fecha + 'T' + b.hora);
      return fechaA - fechaB;
    });

    // Próxima cita
    const proximaCita = citasFuturas.length > 0 ? citasFuturas[0] : null;

    // Servicios más populares
    const serviciosCount = citas.reduce((acc, cita) => {
      const servicio = cita.servicio;
      if (servicio) {
        acc[servicio] = (acc[servicio] || 0) + 1;
      }
      return acc;
    }, {});

    const serviciosMasPopulares = Object.entries(serviciosCount)
      .sort((a, b) => b[1] - a[1]);

    return {
      totalCitas,
      proximaCita,
      serviciosMasPopulares,
      citasFuturas
    };
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