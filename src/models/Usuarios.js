// ==========================================
// UTILIDADES DE ENCRIPTACIÓN
// ==========================================
const CryptoUtils = {
  hashPassword: (password) => {
    return btoa(password + 'URBANBARBER_SALT_2025');
  },
  
  verifyPassword: (password, hash) => {
    return CryptoUtils.hashPassword(password) === hash;
  }
};

// ==========================================
// CLASE BASE USUARIO
// ==========================================
class Usuario {
  constructor(nombre, apellido, correo, celular, password, username = null) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.celular = celular;
    this.password = password;
    this.username = username || correo.split('@')[0]; // Username por defecto
    this.fechaRegistro = new Date().toISOString();
    this.rol = 'cliente'; // Rol por defecto
    this.id = Date.now() + Math.random(); // ID único
  }

  // Validar nombre
  validarNombre() {
    if (!this.nombre || this.nombre.trim().length < 2) {
      return { valido: false, mensaje: "El nombre debe tener al menos 2 caracteres" };
    }
    return { valido: true };
  }

  // Validar correo
  validarCorreo() {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.correo || !regexCorreo.test(this.correo)) {
      return { valido: false, mensaje: "El correo electrónico no es válido" };
    }
    return { valido: true };
  }

  // Validar celular
  validarCelular() {
    const regexCelular = /^3\d{9}$/;
    if (!this.celular || !regexCelular.test(this.celular)) {
      return { valido: false, mensaje: "El celular debe tener 10 dígitos y comenzar con 3" };
    }
    return { valido: true };
  }

  // Validar contraseña
  validarPassword() {
    if (!this.password || this.password.length < 6) {
      return { valido: false, mensaje: "La contraseña debe tener al menos 6 caracteres" };
    }
    return { valido: true };
  }

  // Validar username
  validarUsername() {
    if (!this.username || this.username.length < 3) {
      return { valido: false, mensaje: "El usuario debe tener al menos 3 caracteres" };
    }
    return { valido: true };
  }

  // Validación principal
  validar() {
    const validaciones = [
      this.validarNombre(),
      this.validarCorreo(),
      this.validarCelular(),
      this.validarPassword(),
      this.validarUsername()
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

  // Encriptar contraseña
  encriptarPassword() {
    this.password = CryptoUtils.hashPassword(this.password);
  }

  // Convertir a objeto
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      celular: this.celular,
      password: this.password,
      rol: this.rol,
      fechaRegistro: this.fechaRegistro
    };
  }

  // ==========================================
  // MÉTODOS ESTÁTICOS - SERVICIO DE AUTH
  // ==========================================

  // Obtener todos los usuarios
  static obtenerTodos() {
    try {
      const users = localStorage.getItem('urbanbarber_users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  // Guardar usuarios
  static guardarTodos(users) {
    try {
      localStorage.setItem('urbanbarber_users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error al guardar usuarios:', error);
      return false;
    }
  }

  // Registrar nuevo usuario
  static registrar(userData) {
    const users = Usuario.obtenerTodos();
    
    // Validar que no exista
    const existe = users.find(
      u => u.username === userData.username || 
           u.correo === userData.correo ||
           u.celular === userData.celular
    );
    
    if (existe) {
      return {
        success: false,
        mensaje: 'El usuario, correo o celular ya está registrado'
      };
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario(
      userData.nombre,
      userData.apellido,
      userData.correo,
      userData.celular,
      userData.password,
      userData.username
    );

    // Validar
    const validacion = nuevoUsuario.validar();
    if (!validacion.valido) {
      return {
        success: false,
        mensaje: validacion.mensaje
      };
    }

    // Encriptar contraseña
    nuevoUsuario.encriptarPassword();

    // Guardar
    users.push(nuevoUsuario.toJSON());
    Usuario.guardarTodos(users);

    return {
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario.toJSON()
    };
  }

  // Iniciar sesión
  static login(username, password) {
    const users = Usuario.obtenerTodos();
    
    // Buscar usuario por username, correo o celular
    const user = users.find(
      u => u.username === username || 
           u.correo === username || 
           u.celular === username
    );
    
    if (!user) {
      return {
        success: false,
        mensaje: 'Usuario no encontrado'
      };
    }

    // Verificar contraseña
    if (!CryptoUtils.verifyPassword(password, user.password)) {
      return {
        success: false,
        mensaje: 'Contraseña incorrecta'
      };
    }

    // Crear sesión
    const session = {
      userId: user.id,
      username: user.username,
      rol: user.rol,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('urbanbarber_session', JSON.stringify(session));

    return {
      success: true,
      mensaje: 'Inicio de sesión exitoso',
      usuario: user
    };
  }

  // Cerrar sesión
  static logout() {
    localStorage.removeItem('urbanbarber_session');
    return { success: true, mensaje: 'Sesión cerrada' };
  }

  // Obtener sesión actual
  static obtenerSesion() {
    try {
      const session = localStorage.getItem('urbanbarber_session');
      if (!session) return null;

      const sessionData = JSON.parse(session);
      const users = Usuario.obtenerTodos();
      const user = users.find(u => u.id === sessionData.userId);

      return user || null;
    } catch (error) {
      return null;
    }
  }

  // Verificar si hay sesión activa
  static haySessionActiva() {
    return Usuario.obtenerSesion() !== null;
  }

  // Exportar usuarios a TXT
  static exportarATxt() {
    const users = Usuario.obtenerTodos();
    
    // Formatear datos (sin contraseñas)
    const datosExportar = users.map(u => ({
      username: u.username,
      nombre: u.nombre,
      apellido: u.apellido,
      correo: u.correo,
      celular: u.celular,
      rol: u.rol,
      fechaRegistro: new Date(u.fechaRegistro).toLocaleString('es-CO')
    }));

    const dataStr = JSON.stringify(datosExportar, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuarios_urbanbarber_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    return { success: true, mensaje: 'Usuarios exportados' };
  }

  // Obtener citas del usuario
  static obtenerCitasDeUsuario(celular) {
    try {
      const todasLasCitas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      return todasLasCitas.filter(cita => cita.telefono === celular);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      return [];
    }
  }

  // Crear usuario administrador por defecto (si no existe)
  static crearAdminPorDefecto() {
    const users = Usuario.obtenerTodos();
    const adminExiste = users.find(u => u.username === 'admin');

    if (!adminExiste) {
      const admin = new Usuario(
        'Administrador',
        'Sistema',
        'admin@urbanbarber.com',
        '3001234567',
        '1234',
        'admin'
      );
      admin.rol = 'admin';
      admin.encriptarPassword();

      users.push(admin.toJSON());
      Usuario.guardarTodos(users);
      
      console.log('✅ Usuario admin creado: admin / 1234');
    }
  }
}

// Crear admin al cargar
Usuario.crearAdminPorDefecto();

export default Usuario;

