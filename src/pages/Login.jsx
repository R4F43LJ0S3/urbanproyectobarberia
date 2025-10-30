import React, { useState, useEffect } from "react";
import "../styles/Login.css";

const Login = () => {
  const [tipoUsuario, setTipoUsuario] = useState(""); // "admin" o "cliente"
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [todasLasCitas, setTodasLasCitas] = useState([]);
  
  // Datos del cliente
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    celular: ""
  });
  const [clienteLogueado, setClienteLogueado] = useState(false);

  // Cargar todas las citas cuando el admin está logueado
  useEffect(() => {
    if (logueado && tipoUsuario === "admin") {
      const citas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      setTodasLasCitas(citas);
    }
  }, [logueado, tipoUsuario]);

  // Cargar citas del cliente cuando está logueado
  useEffect(() => {
    if (clienteLogueado) {
      const citas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      const citasCliente = citas.filter(
        (cita) => cita.telefono === datosCliente.celular
      );
      setTodasLasCitas(citasCliente);
    }
  }, [clienteLogueado, datosCliente.celular]);

  const handleSubmitAdmin = (e) => {
    e.preventDefault();
    if (usuario === "admin" && clave === "1234") {
      setLogueado(true);
    } else {
      alert("❌ Usuario o contraseña incorrectos");
    }
  };

  const handleSubmitCliente = (e) => {
    e.preventDefault();
    const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
    const clienteExiste = clientes.find(c => c.celular === datosCliente.celular);
    
    if (!clienteExiste) {
      clientes.push(datosCliente);
      localStorage.setItem("clientes", JSON.stringify(clientes));
    }
    
    setClienteLogueado(true);
  };

  const cerrarSesion = () => {
    setLogueado(false);
    setClienteLogueado(false);
    setUsuario("");
    setClave("");
    setDatosCliente({ nombre: "", apellido: "", correo: "", celular: "" });
    setTodasLasCitas([]);
    setTipoUsuario("");
  };

  const eliminarCita = (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      const citasActualizadas = todasLasCitas.filter((c) => c.id !== id);
      const todasCitas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      const citasFinales = todasCitas.filter((c) => c.id !== id);
      localStorage.setItem("citasBarberia", JSON.stringify(citasFinales));
      setTodasLasCitas(citasActualizadas);
    }
  };

  const handleChangeCliente = (e) => {
    setDatosCliente({
      ...datosCliente,
      [e.target.name]: e.target.value
    });
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

  // Agrupar citas por fecha
  const citasPorFecha = todasLasCitas.reduce((acc, cita) => {
    const fecha = cita.fecha;
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(cita);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(citasPorFecha).sort((a, b) => new Date(a) - new Date(b));

  // Estadísticas
  const totalCitas = todasLasCitas.length;
  const serviciosMasPopulares = todasLasCitas.reduce((acc, cita) => {
    const servicio = cita.servicio;
    if (servicio) {
      acc[servicio] = (acc[servicio] || 0) + 1;
    }
    return acc;
  }, {});
  const serviciosOrdenados = Object.entries(serviciosMasPopulares).sort((a, b) => b[1] - a[1]);
  
  const ahora = new Date();
  const citasFuturas = todasLasCitas.filter(cita => {
    const fechaCita = new Date(cita.fecha + 'T' + cita.hora);
    return fechaCita > ahora;
  }).sort((a, b) => {
    const fechaA = new Date(a.fecha + 'T' + a.hora);
    const fechaB = new Date(b.fecha + 'T' + b.hora);
    return fechaA - fechaB;
  });
  const proximaCita = citasFuturas.length > 0 ? citasFuturas[0] : null;

  // SELECCIÓN DE TIPO DE USUARIO
  if (!tipoUsuario && !logueado && !clienteLogueado) {
    return (
      <main className="page login-page container">
        <h2 className="page-title">🔐 Inicio de sesión</h2>
        <div className="tipo-usuario-container">
          <div className="tipo-usuario-card" onClick={() => setTipoUsuario("admin")}>
            <div className="tipo-usuario-icon">👨‍💼</div>
            <h3>Administrador</h3>
            <p>Gestiona todas las citas y el sistema</p>
          </div>
          <div className="tipo-usuario-card" onClick={() => setTipoUsuario("cliente")}>
            <div className="tipo-usuario-icon">👤</div>
            <h3>Cliente</h3>
            <p>Consulta tus citas agendadas</p>
          </div>
        </div>
      </main>
    );
  }

  // FORMULARIO DE ADMINISTRADOR
  if (tipoUsuario === "admin" && !logueado) {
    return (
      <main className="page login-page container">
        <button className="btn-volver" onClick={() => setTipoUsuario("")}>
          ← Volver
        </button>
        <h2 className="page-title">👨‍💼 Administrador</h2>
        <form className="card login-form" onSubmit={handleSubmitAdmin}>
          <label>
            Usuario:
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="admin"
              required
            />
          </label>
          <label>
            Contraseña:
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="••••"
              required
            />
          </label>
          <button type="submit" className="btn primary">
            Ingresar
          </button>
          <p className="hint-text">
            💡 Credenciales por defecto: admin / 1234
          </p>
        </form>
      </main>
    );
  }

  // FORMULARIO DE CLIENTE
  if (tipoUsuario === "cliente" && !clienteLogueado) {
    return (
      <main className="page login-page container">
        <button className="btn-volver" onClick={() => setTipoUsuario("")}>
          ← Volver
        </button>
        <h2 className="page-title">👤 Cliente</h2>
        <form className="card login-form" onSubmit={handleSubmitCliente}>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={datosCliente.nombre}
              onChange={handleChangeCliente}
              placeholder="Tu nombre"
              required
            />
          </label>
          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={datosCliente.apellido}
              onChange={handleChangeCliente}
              placeholder="Tu apellido"
              required
            />
          </label>
          <label>
            Correo electrónico:
            <input
              type="email"
              name="correo"
              value={datosCliente.correo}
              onChange={handleChangeCliente}
              placeholder="ejemplo@correo.com"
              required
            />
          </label>
          <label>
            Celular:
            <input
              type="tel"
              name="celular"
              value={datosCliente.celular}
              onChange={handleChangeCliente}
              placeholder="3001234567"
              required
            />
          </label>
          <button type="submit" className="btn primary">
            Continuar
          </button>
          <p className="hint-text">
            💡 Usa el celular que registraste al agendar tu cita
          </p>
        </form>
      </main>
    );
  }

  // PANEL DE ADMINISTRADOR
  if (logueado && tipoUsuario === "admin") {
    return (
      <main className="page login-page container">
        <div className="card admin-panel">
          <div className="admin-header">
            <h2>👨‍💼 Panel del Administrador</h2>
            <button className="btn outline" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>

          {/* ESTADÍSTICAS */}
          <div className="stats-grid">
            <div className="stat-card stat-total">
              <p className="stat-number">{totalCitas}</p>
              <p className="stat-label">Total de Citas</p>
            </div>
            
            {proximaCita ? (
              <div className="stat-card stat-proxima">
                <p className="stat-nombre">{proximaCita.nombre}</p>
                <p className="stat-servicio">{proximaCita.servicio}</p>
                <p className="stat-fecha">{formatearFecha(proximaCita.fecha)}</p>
                <p className="stat-hora">🕐 {formatearHora(proximaCita.hora)}</p>
                <p className="stat-label-small">Próxima Cita</p>
              </div>
            ) : (
              <div className="stat-card stat-vacia">
                <p className="stat-icon">📅</p>
                <p className="stat-label">Sin citas próximas</p>
              </div>
            )}
          </div>

          {/* RESUMEN DE SERVICIOS */}
          {Object.keys(serviciosMasPopulares).length > 0 && (
            <div className="servicios-resumen">
              <h4>📊 Resumen de Servicios</h4>
              <div className="servicios-grid">
                {serviciosOrdenados.map(([servicio, cantidad]) => (
                  <div key={servicio} className="servicio-item">
                    <span className="servicio-nombre">{servicio}</span>
                    <span className="servicio-badge">{cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LISTADO DE CITAS */}
          <h3 className="citas-title">📅 Todas las Citas Registradas</h3>
          
          {todasLasCitas.length === 0 ? (
            <div className="citas-vacio">
              <p className="citas-vacio-icon">📋</p>
              <p>No hay citas registradas en el sistema.</p>
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
                              </p>
                              <p className="cita-detalle">
                                <strong>✂️ Servicio:</strong> {cita.servicio}
                              </p>
                              <p className="cita-detalle">
                                <strong>🕐 Hora:</strong> {formatearHora(cita.hora)}
                              </p>
                              <p className="cita-detalle">
                                <strong>📞 Teléfono:</strong> {cita.telefono}
                              </p>
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

  // PANEL DE CLIENTE
  if (clienteLogueado) {
    return (
      <main className="page login-page container">
        <div className="card cliente-panel">
          <div className="cliente-header">
            <div>
              <h2>👤 Mis Citas</h2>
              <p className="cliente-nombre">
                {datosCliente.nombre} {datosCliente.apellido}
              </p>
            </div>
            <button className="btn outline" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>

          {todasLasCitas.length === 0 ? (
            <div className="citas-vacio">
              <p className="citas-vacio-icon">📅</p>
              <p>No tienes citas agendadas con este número de celular.</p>
              <p className="hint-text">
                Agenda una nueva cita desde la sección de "Citas"
              </p>
            </div>
          ) : (
            <>
              <p className="citas-count">
                Tienes <strong>{todasLasCitas.length}</strong> cita{todasLasCitas.length !== 1 ? 's' : ''} agendada{todasLasCitas.length !== 1 ? 's' : ''}
              </p>
              
              {fechasOrdenadas.map((fecha) => (
                <div key={fecha} className="fecha-grupo">
                  <h4 className="fecha-header">
                    📅 {formatearFecha(fecha)}
                  </h4>
                  
                  <ul className="citas-lista">
                    {citasPorFecha[fecha]
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map((cita) => (
                        <li key={cita.id} className="cita-item-cliente">
                          <div className="cita-info-cliente">
                            <p className="cita-servicio-grande">
                              ✂️ {cita.servicio}
                            </p>
                            <p className="cita-hora-grande">
                              🕐 {formatearHora(cita.hora)}
                            </p>
                            {cita.notas && (
                              <p className="cita-notas">
                                <strong>📝 Notas:</strong> {cita.notas}
                              </p>
                            )}
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