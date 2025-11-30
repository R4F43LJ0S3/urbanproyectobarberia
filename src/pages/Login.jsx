import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import Usuario from "../models/Usuarios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const Login = () => {
 
  const [vista, setVista] = useState('login');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const [misCitas, setMisCitas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('hoy');

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

  // ✅ NUEVO: Actualizar cuando cambia el filtro de fecha
  useEffect(() => {
    if (usuarioActual && usuarioActual.rol === 'admin') {
      cargarTodosLosUsuarios();
    }
  }, [filtroFecha, usuarioActual]);

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

  // FUNCIONES DE ESTADÍSTICAS
  const obtenerFechaHoy = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const obtenerFechaSemana = () => {
    const hoy = new Date();
    const hace7dias = new Date(hoy);
    hace7dias.setDate(hoy.getDate() - 7);
    return hace7dias.toISOString().split('T')[0];
  };

  const obtenerFechaMes = () => {
    const hoy = new Date();
    const hace30dias = new Date(hoy);
    hace30dias.setDate(hoy.getDate() - 30);
    return hace30dias.toISOString().split('T')[0];
  };

  const filtrarCitasPorFecha = (todasLasCitas) => {
    const hoy = obtenerFechaHoy();
    const semana = obtenerFechaSemana();
    const mes = obtenerFechaMes();

    switch (filtroFecha) {
      case 'hoy':
        return todasLasCitas.filter(c => c.fecha === hoy);
      case 'semana':
        return todasLasCitas.filter(c => c.fecha >= semana && c.fecha <= hoy);
      case 'mes':
        return todasLasCitas.filter(c => c.fecha >= mes && c.fecha <= hoy);
      case 'todas':
        return todasLasCitas;
      default:
        return todasLasCitas;
    }
  };

  const calcularEstadisticas = (citas) => {
    const citasFiltradas = filtrarCitasPorFecha(citas);
    
    return {
      totalCitas: citasFiltradas.length,
      citasPagadas: citasFiltradas.filter(c => c.pagado).length,
      citasPendientes: citasFiltradas.filter(c => !c.pagado).length,
      clientesActivos: new Set(citasFiltradas.map(c => c.telefono)).size
    };
  };

  const obtenerCitasPorServicio = (citas) => {
    const citasFiltradas = filtrarCitasPorFecha(citas);
    
    const citasPorServicio = citasFiltradas.reduce((acc, cita) => {
      const servicio = cita.servicio || 'Sin especificar';
      if (!acc[servicio]) {
        acc[servicio] = 0;
      }
      acc[servicio]++;
      return acc;
    }, {});

    return Object.entries(citasPorServicio)
      .map(([nombre, cantidad]) => ({
        nombre: nombre.length > 25 ? nombre.substring(0, 25) + '...' : nombre,
        cantidad
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  };

  const obtenerCitasPorBarbero = (citas) => {
    const citasFiltradas = filtrarCitasPorFecha(citas);
    
    const citasPorBarbero = citasFiltradas.reduce((acc, cita) => {
      const barbero = cita.barbero || 'Sin asignar';
      if (!acc[barbero]) {
        acc[barbero] = 0;
      }
      acc[barbero]++;
      return acc;
    }, {});

    return Object.entries(citasPorBarbero)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  };

  const obtenerCitasPorDia = (citas) => {
    const ultimos7Dias = [];
    const hoy = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      const citasDelDia = citas.filter(c => c.fecha === fechaStr).length;
      
      ultimos7Dias.push({
        fecha: fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
        cantidad: citasDelDia
      });
    }
    
    return ultimos7Dias;
  };

  const COLORES = ['#c59a2f', '#d4af37', '#f4d774', '#ffd966', '#ffed4e', '#8b7355', '#a0826d'];
  const COLORES_PIE = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

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
    const todasLasCitas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
    const citasAMostrar = esAdmin ? todasLasCitas : 
      misCitas.filter(cita => cita.telefono === usuarioActual.celular);
    
    const { citasPorFecha, fechasOrdenadas } = agruparCitasPorFecha(citasAMostrar);
    
    // Calcular estadísticas para admin (se recalcula cuando cambia filtroFecha)
    const stats = esAdmin ? calcularEstadisticas(todasLasCitas) : null;
    const datosServicio = esAdmin ? obtenerCitasPorServicio(todasLasCitas) : [];
    const datosBarbero = esAdmin ? obtenerCitasPorBarbero(todasLasCitas) : [];
    const datosPorDia = esAdmin ? obtenerCitasPorDia(todasLasCitas) : [];

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

          
          {esAdmin && stats && (
            <div style={{
              background: 'var(--card)',
              borderRadius: '16px',
              padding: '32px',
              marginTop: '32px',
              boxShadow: '0 8px 20px var(--shadow)',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <h2 style={{ color: 'var(--accent)', margin: 0 }}>
                  📊 Estadísticas del Sistema
                </h2>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['hoy', 'semana', 'mes', 'todas'].map((filtro) => (
                    <button
                      key={filtro}
                      onClick={() => setFiltroFecha(filtro)}
                      className="btn outline"
                      style={{
                        background: filtroFecha === filtro ? 'var(--accent)' : 'transparent',
                        color: filtroFecha === filtro ? '#fff' : 'var(--accent)',
                        borderColor: filtroFecha === filtro ? 'var(--accent)' : 'var(--border)'
                      }}
                    >
                      {filtro === 'hoy' && '📅 Hoy'}
                      {filtro === 'semana' && '📆 Esta Semana'}
                      {filtro === 'mes' && '📊 Este Mes'}
                      {filtro === 'todas' && '🗂️ Todas'}
                    </button>
                  ))}
                </div>
              </div>

              {/* TARJETAS DE RESUMEN */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #c59a2f 0%, #d4af37 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(197, 154, 47, 0.3)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📅</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {stats.totalCitas}
                  </div>
                  <div style={{ opacity: 0.9 }}>Total de Citas</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {stats.citasPagadas}
                  </div>
                  <div style={{ opacity: 0.9 }}>Citas Pagadas</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⏳</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {stats.citasPendientes}
                  </div>
                  <div style={{ opacity: 0.9 }}>Citas Pendientes</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👥</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {stats.clientesActivos}
                  </div>
                  <div style={{ opacity: 0.9 }}>Clientes Activos</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📝</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {todosLosUsuarios.length}
                  </div>
                  <div style={{ opacity: 0.9 }}>Usuarios Registrados</div>
                </div>
              </div>

              {/* GRÁFICA DE LÍNEA - CITAS POR DÍA */}
              <div style={{
                background: 'var(--input-bg)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ color: 'var(--accent)', marginTop: 0 }}>
                  📈 Citas de los últimos 7 días
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={datosPorDia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="fecha" 
                      stroke="var(--muted)"
                      style={{ fontSize: '0.9rem' }}
                    />
                    <YAxis 
                      stroke="var(--muted)"
                      style={{ fontSize: '0.9rem' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cantidad" 
                      stroke="#c59a2f" 
                      strokeWidth={3}
                      dot={{ fill: '#c59a2f', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '32px',
                marginBottom: '32px'
              }}>
                {/* GRÁFICA DE BARRAS - SERVICIOS */}
                <div style={{
                  background: 'var(--input-bg)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid var(--border)'
                }}>
                  <h3 style={{ color: 'var(--accent)', marginTop: 0 }}>
                    ✂️ Servicios Más Solicitados
                  </h3>
                  {datosServicio.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={datosServicio}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis 
                          dataKey="nombre" 
                          stroke="var(--muted)"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          style={{ fontSize: '0.75rem' }}
                        />
                        <YAxis stroke="var(--muted)" />
                        <Tooltip 
                          contentStyle={{
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="cantidad" fill="#c59a2f">
                          {datosServicio.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
                      No hay datos disponibles
                    </p>
                  )}
                </div>

                {/* GRÁFICA DE BARRAS - BARBEROS */}
                <div style={{
                  background: 'var(--input-bg)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid var(--border)'
                }}>
                  <h3 style={{ color: 'var(--accent)', marginTop: 0 }}>
                    💈 Citas por Barbero
                  </h3>
                  {datosBarbero.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={datosBarbero}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis 
                          dataKey="nombre" 
                          stroke="var(--muted)"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          style={{ fontSize: '0.85rem' }}
                        />
                        <YAxis stroke="var(--muted)" />
                        <Tooltip 
                          contentStyle={{
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="cantidad" fill="#d4af37">
                          {datosBarbero.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
                      No hay datos disponibles
                    </p>
                  )}
                </div>
              </div>

              {/* GRÁFICA DE PASTEL - ESTADO DE PAGOS */}
              <div style={{
                background: 'var(--input-bg)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ color: 'var(--accent)', marginTop: 0, textAlign: 'center' }}>
                  💳 Estado de Pagos
                </h3>
                {stats.totalCitas > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Pagadas', value: stats.citasPagadas },
                          { name: 'Pendientes', value: stats.citasPendientes }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Pagadas', value: stats.citasPagadas },
                          { name: 'Pendientes', value: stats.citasPendientes }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORES_PIE[index % COLORES_PIE.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          background: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
                    No hay datos disponibles
                  </p>
                )}
              </div>
            </div>
          )}      

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