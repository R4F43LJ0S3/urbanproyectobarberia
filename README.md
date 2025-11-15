📋 Descripción del Proyecto
UrbanBarber es una aplicación web moderna desarrollada con React que permite gestionar citas, servicios y usuarios para una barbería. El sistema incluye funcionalidades de reserva online, autenticación de usuarios, gestión de pagos simulados y un panel administrativo completo.

🚀 Tecnologías Utilizadas
Frontend

React 18 - Biblioteca principal
React Router DOM - Navegación SPA
Lucide React - Librería de iconos
CSS3 - Estilos con variables CSS y modo oscuro

Arquitectura

Modelo-Vista-Controlador (MVC) adaptado a React
Programación Orientada a Objetos para modelos de negocio
LocalStorage como persistencia de datos


📁 Estructura del Proyecto
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.js       # Navegación principal
│   ├── Footer.js       # Pie de página
│   └── ScrollToTop.js  # Utilidad de scroll
├── models/             # Modelos de dominio (POO)
│   ├── Usuarios.js     # Gestión de usuarios
│   ├── Administrador.js
│   ├── Clientes.js
│   ├── Citas.js
│   ├── Barberos.js
│   ├── Servicios.js
│   ├── Pagos.js
│   └── Horarios_Barbero.js
├── pages/              # Vistas principales
│   ├── home.jsx
│   ├── Servicios.jsx
│   ├── Barberos.jsx
│   ├── Citas.jsx
│   ├── Pago.jsx
│   ├── Contacto.jsx
│   └── Login.jsx
├── styles/             # Estilos modulares
└── App.js             # Configuración de rutas

🏗️ Arquitectura de Modelos
El proyecto implementa una arquitectura orientada a objetos con modelos independientes:
Clase Base: Usuario
javascriptclass Usuario {
  constructor(nombre, apellido, correo, celular, password, username = null) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.celular = celular;
    this.password = password;
    this.username = username || correo.split('@')[0];
    this.fechaRegistro = new Date().toISOString();
    this.rol = 'cliente';
    this.id = Date.now() + Math.random();
  }

  // Métodos de validación
  validarNombre() { /* ... */ }
  validarCorreo() { /* ... */ }
  validarCelular() { /* ... */ }
  validar() { /* ... */ }

  // Métodos estáticos de servicio
  static registrar(userData) { /* ... */ }
  static login(username, password) { /* ... */ }
  static obtenerSesion() { /* ... */ }
}
Herencia: Cliente y Administrador
javascriptclass Cliente extends Usuario {
  constructor(nombre, apellido, correo, celular, password, direccion = "") {
    super(nombre, apellido, correo, celular, password);
    this.direccion = direccion;
    this.tipo = "cliente";
    this.citasAgendadas = [];
    this.puntosFidelidad = 0;
  }
}

class Administrador extends Usuario {
  constructor(nombre, apellido, correo, celular, password, nivelAcceso = "admin") {
    super(nombre, apellido, correo, celular, password);
    this.tipo = "administrador";
    this.nivelAcceso = nivelAcceso;
    this.permisos = this.asignarPermisos();
  }
}

🔐 Sistema de Autenticación
Encriptación de Contraseñas
javascriptconst CryptoUtils = {
  hashPassword: (password) => {
    return btoa(password + 'URBANBARBER_SALT_2025');
  },
  verifyPassword: (password, hash) => {
    return CryptoUtils.hashPassword(password) === hash;
  }
};
Gestión de Sesiones
El sistema utiliza localStorage para mantener la sesión del usuario:
javascript// Crear sesión
const session = {
  userId: user.id,
  username: user.username,
  rol: user.rol,
  loginTime: new Date().toISOString()
};
localStorage.setItem('urbanbarber_session', JSON.stringify(session));

// Obtener sesión actual
static obtenerSesion() {
  const session = localStorage.getItem('urbanbarber_session');
  if (!session) return null;
  
  const sessionData = JSON.parse(session);
  const users = Usuario.obtenerTodos();
  return users.find(u => u.id === sessionData.userId) || null;
}
Credenciales por Defecto
javascriptUsuario: admin
Contraseña: 1234
Rol: Administrador

📅 Sistema de Citas
Modelo de Cita
javascriptclass Cita {
  constructor(id, clienteId, barberoId, servicioId, fecha, hora, notas = "") {
    this.id = id;
    this.clienteId = clienteId;
    this.barberoId = barberoId;
    this.servicioId = servicioId;
    this.fecha = fecha; // YYYY-MM-DD
    this.hora = hora;   // HH:MM
    this.notas = notas;
    this.estado = "pendiente";
    this.pagado = false;
  }

  validar() {
    // Validaciones de fecha, hora, IDs, etc.
  }

  static crearDesdeFomulario(formData) {
    // Factory method para crear desde formulario web
  }
}
Validaciones Implementadas

Fecha no puede ser anterior a hoy
Hora en formato 24h (HH:MM)
Horario de atención: 07:00 - 22:00
Notas máximo 200 caracteres
Campos obligatorios verificados


💳 Sistema de Pagos
Modelo de Pago
javascriptclass Pago {
  constructor(id, citaId, monto, metodoPago, tipo = "completo") {
    this.id = id;
    this.citaId = citaId;
    this.monto = monto;
    this.metodoPago = metodoPago; // "nequi", "efectivo", "tarjeta"
    this.tipo = tipo; // "completo" o "deposito" (50%)
    this.estado = "pendiente";
    this.transaccionId = this.generarTransaccionId();
  }

  generarTransaccionId() {
    return `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  async procesarPago() {
    this.estado = "procesando";
    
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
}
Opciones de Pago

Pago Completo: 100% del servicio
Depósito del 50%: Paga el resto en la barbería


🎨 Sistema de Temas
Modo Oscuro
El sistema implementa un modo oscuro completo utilizando variables CSS:
javascriptconst toggleTheme = () => {
  setDarkMode(!darkMode);
  if (!darkMode) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
};
Variables CSS
css:root {
  --bg: #f7f7f7;
  --card: #ffffff;
  --text: #111;
  --accent: #c59a2f;
  --muted: #6b6b6b;
  --shadow: rgba(0, 0, 0, 0.08);
  --border: #e5e5e5;
}

body.dark-mode {
  --bg: #121212;
  --card: #1e1e1e;
  --text: #e8e8e8;
  --accent: #d4a944;
  --muted: #a8a8a8;
  --shadow: rgba(0, 0, 0, 0.3);
  --border: #333333;
}

🔧 Instalación y Configuración
Requisitos Previos

Node.js 16+
npm o yarn

Instalación
bash# Clonar el repositorio
git clone https://github.com/tu-usuario/urbanbarber.git

# Instalar dependencias
cd urbanbarber
npm install

# Iniciar servidor de desarrollo
npm start
Build para Producción
bashnpm run build

📊 Persistencia de Datos
Estructura de LocalStorage
javascript// Usuarios
localStorage.setItem('urbanbarber_users', JSON.stringify(users));

// Sesión activa
localStorage.setItem('urbanbarber_session', JSON.stringify(session));

// Citas
localStorage.setItem('citasBarberia', JSON.stringify(citas));

// Tema
localStorage.setItem('theme', 'dark' | 'light');
Exportación de Datos
javascriptstatic exportarATxt() {
  const users = Usuario.obtenerTodos();
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
}
```

---

## 🛡️ Validaciones del Sistema

### Validación de Usuarios

- **Nombre**: Mínimo 2 caracteres
- **Email**: Formato válido con regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Celular**: 10 dígitos, debe comenzar con 3
- **Contraseña**: Mínimo 6 caracteres
- **Username**: Mínimo 3 caracteres, único en el sistema

### Validación de Citas

- **Fecha**: No puede ser anterior al día actual
- **Hora**: Formato HH:MM, rango 07:00 - 22:00
- **Teléfono**: 10 dígitos obligatorios
- **Servicio**: Debe seleccionarse de la lista predefinida

---

## 🎯 Funcionalidades Principales

### Para Clientes

1. ✅ Registro e inicio de sesión
2. ✅ Agendar citas con validaciones en tiempo real
3. ✅ Selección de servicios y horarios
4. ✅ Simulación de pago (Nequi)
5. ✅ Historial de citas personal
6. ✅ Cancelación de citas
7. ✅ Modo oscuro/claro

### Para Administradores

1. ✅ Panel administrativo completo
2. ✅ Visualización de todos los usuarios registrados
3. ✅ Gestión de todas las citas del sistema
4. ✅ Exportación de usuarios a TXT
5. ✅ Estadísticas básicas del sistema
6. ✅ Permisos diferenciados

---

## 🔄 Flujo de Trabajo Principal

### 1. Registro/Login de Usuario
```
Usuario → Formulario → Validación → Encriptación → LocalStorage → Sesión Activa
```

### 2. Agendamiento de Cita
```
Cliente → Formulario Cita → Validación → Pago → Confirmación → LocalStorage
```

### 3. Procesamiento de Pago
```
Selección Método → Confirmación → Simulación (2s) → Cita Pagada → Redirección

🚧 Limitaciones Conocidas

Persistencia: Los datos se almacenan en localStorage, no hay backend real
Seguridad: La encriptación es básica (Base64), no apta para producción
Concurrencia: No hay validación de disponibilidad real de horarios
Pagos: Sistema simulado, no hay integración con pasarelas reales


🔮 Mejoras Futuras
Backend Real

Implementar API REST con Node.js/Express
Base de datos MongoDB o PostgreSQL
Autenticación JWT

Funcionalidades Adicionales

Notificaciones por email/SMS
Sistema de recordatorios automáticos
Integración con calendario (Google Calendar)
Valoraciones y reseñas de servicios
Sistema de puntos de fidelidad funcional
Chat en tiempo real con la barbería

Seguridad

Implementar bcrypt para passwords
HTTPS obligatorio
Rate limiting en endpoints
Validación del lado del servidor


📝 Patrones de Diseño Utilizados
Factory Pattern
javascriptstatic crearDesdeFomulario(formData) {
  // Crea instancias de Cita desde datos del formulario
}
Singleton Pattern
javascriptstatic obtenerSesion() {
  // Solo una sesión activa por usuario
}
Observer Pattern
javascriptuseEffect(() => {
  // Observa cambios en la sesión
  const user = Usuario.obtenerSesion();
  if (user) {
    setUsuarioActual(user);
  }
}, []);

🧪 Testing (Sugerido)
Tests Unitarios Recomendados
javascript// Ejemplo con Jest
describe('Usuario', () => {
  test('debe validar email correctamente', () => {
    const usuario = new Usuario('Juan', 'Pérez', 'invalido', '3001234567', '123456');
    const resultado = usuario.validarCorreo();
    expect(resultado.valido).toBe(false);
  });

  test('debe encriptar contraseñas', () => {
    const usuario = new Usuario('Juan', 'Pérez', 'juan@test.com', '3001234567', '123456');
    usuario.encriptarPassword();
    expect(usuario.password).not.toBe('123456');
  });
});

📄 Licencia
Este proyecto es un prototipo educativo desarrollado para demostrar habilidades en React y arquitectura frontend.

👥 Contribuciones
Las contribuciones son bienvenidas. Por favor:

Fork el proyecto
Crea una rama para tu feature (git checkout -b feature/AmazingFeature)
Commit tus cambios (git commit -m 'Add some AmazingFeature')
Push a la rama (git push origin feature/AmazingFeature)
Abre un Pull Request


📧 Contacto
UrbanBarber
📍 Valledupar, Cesar, Colombia
📞 300 456 7890
📧 contacto@urbanbarber.com

🙏 Agradecimientos

React Team por la excelente documentación
Unsplash por las imágenes de muestra
Lucide por los iconos modernos