import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import Usuario from "../models/Usuarios";

const Login = () => {
 
  const [vista, setVista] = useState('login');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const [misCitas, setMisCitas] = useState([]);

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    correo: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    celular: ''
  });

  useEffect(() => {
    const user = Usuario.obtenerSesion();
    if (user) {
      setUsuarioActual(user);
      setVista('profile');
      cargarCitasDelUsuario(user.celular);
    }
    cargarTodosLosUsuarios();
  }, []);

  const cargarTodosLosUsuarios = () => {
    setTodosLosUsuarios(Usuario.obtenerTodos());
  };

  const cargarCitasDelUsuario = (celular) => {
    const citas = Usuario.obtenerCitasDeUsuario(celular);
    setMisCitas(citas);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!loginForm.username || !loginForm.password) {
      alert('❌ Por favor completa todos los campos');
      return;
    }

    const resultado = Usuario.login(loginForm.username, loginForm.password);
    
    if (resultado.success) {
      setUsuarioActual(resultado.usuario);
      setVista('profile');
      cargarCitasDelUsuario(resultado.usuario.celular);
      setLoginForm({ username: '', password: '' });
      cargarTodosLosUsuarios();
      alert(`✅ ${resultado.mensaje}`);
    } else {
      alert(`❌ ${resultado.mensaje}`);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (Object.values(registerForm).some(val => !val)) {
      alert('❌ Por favor completa todos los campos');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    if (registerForm.password.length < 6) {
      alert('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (registerForm.celular.length !== 10 || !registerForm.celular.startsWith('3')) {
      alert('❌ El celular debe tener 10 dígitos y comenzar con 3');
      return;
    }

    const resultado = Usuario.registrar({
      username: registerForm.username,
      nombre: registerForm.nombre,
      apellido: registerForm.apellido,
      correo: registerForm.correo,
      celular: registerForm.celular,
      password: registerForm.password
    });

    if (resultado.success) {
      alert('✅ Usuario registrado exitosamente');
      setVista('login');
      setRegisterForm({
        username: '',
        correo: '',
        password: '',
        confirmPassword: '',
        nombre: '',
        apellido: '',
        celular: ''
      });
      cargarTodosLosUsuarios();
    } else {
      alert(`❌ ${resultado.mensaje}`);
    }
  };

  const handleLogout = () => {
    Usuario.logout();
    setUsuarioActual(null);
    setMisCitas([]);
    setVista('login');
  };

  const handleExportUsers = () => {
    const resultado = Usuario.exportarATxt();
    if (resultado.success) {
      alert('✅ ¡Archivo de usuarios descargado!');
    }
  };

  const handleEliminarUsuario = (userId, username) => {
    if (username === 'admin') {
      alert('❌ No se puede eliminar el usuario administrador principal');
      return;
    }

    if (userId === usuarioActual.id) {
      alert('❌ No puedes eliminar tu propia cuenta mientras estás conectado');
      return;
    }

    if (window.confirm(`⚠️ ¿Estás seguro de eliminar al usuario @${username}?\n\nEsta acción no se puede deshacer.`)) {
      const resultado = Usuario.eliminarUsuario(userId);
      
      if (resultado.success) {
        alert('✅ Usuario eliminado correctamente');
        cargarTodosLosUsuarios();
      } else {
        alert(`❌ ${resultado.mensaje}`);
      }
    }
  };

  const eliminarCita = (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      try {
        const citas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
        const citasActualizadas = citas.filter(c => c.id !== id);
        localStorage.setItem("citasBarberia", JSON.stringify(citasActualizadas));
        setMisCitas(prev => prev.filter(c => c.id !== id));
        alert('✅ Cita eliminada');
      } catch (error) {
        alert('❌ Error al eliminar la cita');
      }
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatearHora = (hora) => {
    const [horas, minutos] = hora.split(':');
    const h = parseInt(horas);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hora12 = h % 12 || 12;
    return `${hora12}:${minutos} ${ampm}`;
  };

  const agruparCitasPorFecha = (citas) => {
    const citasPorFecha = citas.reduce((acc, cita) => {
      const fecha = cita.fecha;
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(cita);
      return acc;
    }, {});

    const fechasOrdenadas = Object.keys(citasPorFecha).sort((a, b) => 
      new Date(a) - new Date(b)
    );

    return { citasPorFecha, fechasOrdenadas };
  };

  if (vista === 'login') {
    return (
      <main className="page login-page container">
        <h2 className="page-title">🔐 Iniciar Sesión</h2>
        <p className="page-subtitle">Accede a tu cuenta de Urban Barber</p>

        <div className="card login-form">
          <div>
            <label>
              Usuario, Email o Celular
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({
                  ...loginForm,
                  username: e.target.value
                })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleLogin(e);
                }}
                placeholder="Ingresa tu usuario, email o celular"
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({
                  ...loginForm,
                  password: e.target.value
                })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleLogin(e);
                }}
                placeholder="Ingresa tu contraseña"
              />
            </label>

            <button
              onClick={handleLogin}
              className="btn primary"
            >
              Iniciar Sesión
            </button>

            <div className="login-divider">
              <p>¿No tienes cuenta?</p>
              <button
                onClick={() => setVista('register')}
                className="btn outline"
              >
                Crear Cuenta Nueva
              </button>
            </div>

            <p className="hint-text">
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (vista === 'register') {
    return (
      <main className="page login-page container">
        <button className="btn-volver" onClick={() => setVista('login')}>
          ← Volver al Login
        </button>

        <h2 className="page-title">✍️ Crear Cuenta Nueva</h2>
        <p className="page-subtitle">Regístrate en Urban Barber</p>

        <div className="card login-form register-form">
          <div className="register-grid">
            <label>
              Usuario *
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  username: e.target.value
                })}
                placeholder="Usuario único"
              />
            </label>

            <label>
              Email *
              <input
                type="email"
                value={registerForm.correo}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  correo: e.target.value
                })}
                placeholder="correo@ejemplo.com"
              />
            </label>

            <label>
              Nombre *
              <input
                type="text"
                value={registerForm.nombre}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  nombre: e.target.value
                })}
                placeholder="Tu nombre"
              />
            </label>

            <label>
              Apellido *
              <input
                type="text"
                value={registerForm.apellido}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  apellido: e.target.value
                })}
                placeholder="Tu apellido"
              />
            </label>

            <label>
              Celular * (Solo números)
              <input
                type="tel"
                value={registerForm.celular}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, '');
                  setRegisterForm({
                    ...registerForm,
                    celular: valor
                  });
                }}
                maxLength="10"
                placeholder="3001234567"
              />
              <small style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                Debe comenzar con 3 y tener 10 dígitos
              </small>
            </label>

            <label>
              Contraseña *
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  password: e.target.value
                })}
                placeholder="Mínimo 6 caracteres"
              />
            </label>

            <label className="full-width">
              Confirmar Contraseña *
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  confirmPassword: e.target.value
                })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleRegister(e);
                }}
                placeholder="Repite la contraseña"
              />
            </label>
          </div>

          <div className="form-actions">
            <button onClick={handleRegister} className="btn primary">
              Registrarse
            </button>
            <button onClick={() => setVista('login')} className="btn outline">
              Cancelar
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (vista === 'profile' && usuarioActual) {
    const esAdmin = usuarioActual.rol === 'admin';
    const citasAMostrar = esAdmin ? 
      JSON.parse(localStorage.getItem("citasBarberia") || "[]") : 
      misCitas.filter(cita => cita.telefono === usuarioActual.celular);
    
    const { citasPorFecha, fechasOrdenadas } = agruparCitasPorFecha(citasAMostrar);

    return (
      <main className="page login-page container">
        <div className="card admin-panel">
          <div className="admin-header">
            <h2>
              {esAdmin ? '👨‍💼 Panel de Administrador' : '👤 Mi Perfil'}
            </h2>
            <div className="header-actions">
              {esAdmin && (
                <button
                  onClick={handleExportUsers}
                  className="btn outline"
                  style={{ marginRight: '8px' }}
                >
                  📥 Exportar Usuarios
                </button>
              )}
              <button onClick={handleLogout} className="btn outline">
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="perfil-info">
            <div className="perfil-item">
              <span className="perfil-label">Usuario</span>
              <span className="perfil-value">@{usuarioActual.username}</span>
            </div>
            <div className="perfil-item">
              <span className="perfil-label">Nombre Completo</span>
              <span className="perfil-value">
                {usuarioActual.nombre} {usuarioActual.apellido}
              </span>
            </div>
            <div className="perfil-item">
              <span className="perfil-label">Email</span>
              <span className="perfil-value">{usuarioActual.correo}</span>
            </div>
            <div className="perfil-item">
              <span className="perfil-label">Teléfono</span>
              <span className="perfil-value">{usuarioActual.celular}</span>
            </div>
            <div className="perfil-item">
              <span className="perfil-label">Fecha de Registro</span>
              <span className="perfil-value">
                {new Date(usuarioActual.fechaRegistro).toLocaleDateString('es-CO')}
              </span>
            </div>
            <div className="perfil-item">
              <span className="perfil-label">Rol</span>
              <span className="perfil-badge">
                {usuarioActual.rol.toUpperCase()}
              </span>
            </div>
          </div>

          {esAdmin && (
            <div className="usuarios-section">
              <h3 className="citas-title">
                👥 Usuarios Registrados ({todosLosUsuarios.length})
              </h3>
              <div className="usuarios-grid">
                {todosLosUsuarios.map((user) => (
                  <div
                    key={user.id}
                    className={`usuario-card ${user.id === usuarioActual.id ? 'usuario-actual' : ''}`}
                  >
                    <div className="usuario-header">
                      <h4>
                        {user.nombre} {user.apellido}
                        {user.id === usuarioActual.id && (
                          <span className="badge-tu">TÚ</span>
                        )}
                      </h4>
                      <span className={`rol-badge rol-${user.rol}`}>
                        {user.rol}
                      </span>
                    </div>
                    <p className="usuario-info">
                      @{user.username}
                    </p>
                    <p className="usuario-info">
                      📧 {user.correo}
                    </p>
                    <p className="usuario-info">
                      📞 {user.celular}
                    </p>
                    <p className="usuario-fecha">
                      Registro: {new Date(user.fechaRegistro).toLocaleDateString('es-CO')}
                    </p>
                    
                    {user.id !== usuarioActual.id && user.username !== 'admin' && (
                      <button
                        onClick={() => handleEliminarUsuario(user.id, user.username)}
                        className="btn outline"
                        style={{ 
                          marginTop: '12px', 
                          width: '100%',
                          background: 'transparent',
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          fontSize: '0.9rem'
                        }}
                      >
                        🗑️ Eliminar Usuario
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <h3 className="citas-title">
            {esAdmin ? '📅 Todas las Citas Registradas' : '📅 Mis Citas'}
            {' '}({citasAMostrar.length})
          </h3>

          {citasAMostrar.length === 0 ? (
            <div className="citas-vacio">
              <p className="citas-vacio-icon">📋</p>
              <p>
                {esAdmin 
                  ? 'No hay citas registradas en el sistema.' 
                  : 'No tienes citas agendadas.'}
              </p>
            </div>
          ) : (
            <>
              {fechasOrdenadas.map((fecha) => (
                <div key={fecha} className="fecha-grupo">
                  <h4 className="fecha-header">
                    📅 {formatearFecha(fecha)}
                  </h4>
                  
                  <ul className="citas-lista">
                    {citasPorFecha[fecha]
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map((cita) => (
                        <li key={cita.id} className="cita-item">
                          <div className="cita-contenido">
                            <div className="cita-info">
                              <p className="cita-nombre">
                                <strong>👤 {cita.nombre}</strong>
                                {cita.pagado && (
                                  <span className="badge-pagado">✓ Pagado</span>
                                )}
                              </p>
                              <p className="cita-detalle">
                                <strong>✂️ Servicio:</strong> {cita.servicio}
                              </p>
                              <p className="cita-detalle">
                                <strong>🕐 Hora:</strong> {formatearHora(cita.hora)}
                              </p>
                              <p className="cita-detalle">
                                <strong>💈 Barbero:</strong> {cita.barbero || "No especificado"}
                              </p>
                              {esAdmin && (
                                <p className="cita-detalle">
                                  <strong>📞 Teléfono:</strong> {cita.telefono}
                                </p>
                              )}
                              {cita.notas && (
                                <p className="cita-notas">
                                  <strong>📝 Notas:</strong> {cita.notas}
                                </p>
                              )}
                            </div>
                            <button
                              className="btn outline"
                              onClick={() => eliminarCita(cita.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    );
  }

  return null;
};

export default Login;