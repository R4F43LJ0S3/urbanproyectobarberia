import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import Administrador from "../models/Administrador";
import Cliente from "../models/Clientes";
import Cita from "../models/Citas";

const Login = () => {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [adminLogueado, setAdminLogueado] = useState(null);
  const [clienteLogueado, setClienteLogueado] = useState(null);
  const [todasLasCitas, setTodasLasCitas] = useState([]);
  
  // Datos del cliente
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    celular: ""
  });

  // Cargar citas cuando hay un usuario logueado
  useEffect(() => {
    if (adminLogueado) {
      const citas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      setTodasLasCitas(citas);
    }
  }, [adminLogueado]);

  useEffect(() => {
    if (clienteLogueado) {
      const misCitas = clienteLogueado.obtenerMisCitas();
      setTodasLasCitas(misCitas);
    }
  }, [clienteLogueado]);

  // 🎯 REFACTORIZADO: Autenticación de admin usando la clase
  const handleSubmitAdmin = (e) => {
    e.preventDefault();
    
    const resultado = Administrador.autenticar(usuario, clave);
    
    if (resultado.exito) {
      setAdminLogueado(resultado.admin);
    } else {
      alert(`❌ ${resultado.mensaje}`);
    }
  };

  // 🎯 REFACTORIZADO: Autenticación de cliente usando la clase
  const handleSubmitCliente = (e) => {
    e.preventDefault();
    
    const resultado = Cliente.autenticarORegistrar(datosCliente);
    
    if (!resultado.exito) {
      alert(`❌ ${resultado.mensaje}`);
      return;
    }

    // Guardar cliente si no existe
    const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
    const clienteExiste = clientes.find(c => c.celular === datosCliente.celular);
    
    if (!clienteExiste) {
      clientes.push(resultado.cliente.toJSON());
      localStorage.setItem("clientes", JSON.stringify(clientes));
    }
    
    setClienteLogueado(resultado.cliente);
  };

  const cerrarSesion = () => {
    setAdminLogueado(null);
    setClienteLogueado(null);
    setUsuario("");
    setClave("");
    setDatosCliente({ nombre: "", apellido: "", correo: "", celular: "" });
    setTodasLasCitas([]);
    setTipoUsuario("");
  };

  // 🎯 REFACTORIZADO: Eliminar cita usando método estático
  const eliminarCita = (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      const resultado = Cita.eliminar(id);
      if (resultado.exito) {
        setTodasLasCitas(prev => prev.filter(c => c.id !== id));
      }
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

  // SELECCIÓN DE TIPO DE USUARIO
  if (!tipoUsuario && !adminLogueado && !clienteLogueado) {
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
  if (tipoUsuario === "admin" && !adminLogueado) {
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
  if (adminLogueado) {
    // 🎯 REFACTORIZADO: Obtener estadísticas usando método de la clase
    const estadisticas = adminLogueado.obtenerEstadisticas(todasLasCitas);

    // Agrupar citas por fecha
    const citasPorFecha = todasLasCitas.reduce((acc, cita) => {
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
              <p className="stat-number">{estadisticas.totalCitas}</p>
              <p className="stat-label">Total de Citas</p>
            </div>
            
            {estadisticas.proximaCita ? (
              <div className="stat-card stat-proxima">
                <p className="stat-nombre">{estadisticas.proximaCita.nombre}</p>
                <p className="stat-servicio">{estadisticas.proximaCita.servicio}</p>
                <p className="stat-fecha">{formatearFecha(estadisticas.proximaCita.fecha)}</p>
                <p className="stat-hora">🕐 {formatearHora(estadisticas.proximaCita.hora)}</p>
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
          {estadisticas.serviciosMasPopulares.length > 0 && (
            <div className="servicios-resumen">
              <h4>📊 Resumen de Servicios</h4>
              <div className="servicios-grid">
                {estadisticas.serviciosMasPopulares.map(([servicio, cantidad]) => (
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
    const { citasPorFecha, fechasOrdenadas } = clienteLogueado.agruparCitasPorFecha(todasLasCitas);

    return (
      <main className="page login-page container">
        <div className="card cliente-panel">
          <div className="cliente-header">
            <div>
              <h2>👤 Mis Citas</h2>
              <p className="cliente-nombre">
                {clienteLogueado.getNombreCompleto()}
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