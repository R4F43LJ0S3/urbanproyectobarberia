import React, { useState, useEffect } from "react";
import "../styles/Login.css";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [todasLasCitas, setTodasLasCitas] = useState([]);

  // Cargar todas las citas cuando el admin está logueado
  useEffect(() => {
    if (logueado) {
      const citas = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      setTodasLasCitas(citas);
    }
  }, [logueado]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Usuario y clave simulados
    if (usuario === "admin" && clave === "1234") {
      setLogueado(true);
    } else {
      alert("❌ Usuario o contraseña incorrectos");
    }
  };

  const cerrarSesion = () => {
    setLogueado(false);
    setUsuario("");
    setClave("");
    setTodasLasCitas([]);
  };

  const eliminarCita = (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      const citasActualizadas = todasLasCitas.filter((c) => c.id !== id);
      localStorage.setItem("citasBarberia", JSON.stringify(citasActualizadas));
      setTodasLasCitas(citasActualizadas);
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

  // Agrupar citas por fecha
  const citasPorFecha = todasLasCitas.reduce((acc, cita) => {
    const fecha = cita.fecha;
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(cita);
    return acc;
  }, {});

  // Ordenar fechas
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
  
  // Encontrar la próxima cita
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

  return (
    <main className="page login-page container">
      {!logueado ? (
        <>
          <h2 className="page-title">🔐 Inicio de sesión (Administrador)</h2>
          <form className="card login-form" onSubmit={handleSubmit}>
            <label>
              Usuario:
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="admin"
              />
            </label>
            <label>
              Contraseña:
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="••••"
              />
            </label>
            <button type="submit" className="btn primary">
              Ingresar
            </button>
            <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#6b6b6b', textAlign: 'center' }}>
              💡 Credenciales por defecto: admin / 1234
            </p>
          </form>
        </>
      ) : (
        <div className="card admin-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ margin: 0 }}>👨‍💼 Panel del Administrador</h2>
            <button className="btn outline" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>

          {/* ESTADÍSTICAS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
              padding: '20px',
              borderRadius: '12px',
              color: 'white',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>{totalCitas}</p>
              <p style={{ margin: '8px 0 0', fontSize: '0.95rem' }}>Total de Citas</p>
            </div>
            
            {proximaCita ? (
              <div style={{
                background: 'linear-gradient(135deg, #c59a2f 0%, #a67c00 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.3' }}>{proximaCita.nombre}</p>
                <p style={{ margin: '6px 0', fontSize: '0.85rem', opacity: 0.9 }}>{proximaCita.servicio}</p>
                <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: 'bold' }}>
                  {formatearFecha(proximaCita.fecha)}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>
                  🕐 {formatearHora(proximaCita.hora)}
                </p>
                <p style={{ margin: '8px 0 0', fontSize: '0.8rem', opacity: 0.85 }}>Próxima Cita</p>
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '2rem' }}>📅</p>
                <p style={{ margin: '8px 0 0', fontSize: '0.95rem' }}>Sin citas próximas</p>
              </div>
            )}
          </div>

          {/* RESUMEN DE SERVICIOS */}
          {Object.keys(serviciosMasPopulares).length > 0 && (
            <div style={{
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '32px'
            }}>
              <h4 style={{ color: 'var(--accent)', marginTop: 0 }}>📊 Resumen de Servicios</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                {serviciosOrdenados.map(([servicio, cantidad]) => (
                  <div key={servicio} style={{
                    background: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.9rem', color: '#333' }}>{servicio}</span>
                    <span style={{
                      background: 'var(--accent)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {cantidad}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LISTADO DE CITAS */}
          <h3 style={{ color: 'var(--accent)' }}>📅 Todas las Citas Registradas</h3>
          
          {todasLasCitas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b6b6b' }}>
              <p style={{ fontSize: '3rem', margin: '0 0 12px' }}>📋</p>
              <p>No hay citas registradas en el sistema.</p>
            </div>
          ) : (
            <>
              {fechasOrdenadas.map((fecha) => (
                <div key={fecha} style={{ marginBottom: '32px' }}>
                  <h4 style={{ 
                    background: 'rgba(197, 154, 47, 0.1)', 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    color: 'var(--accent)',
                    marginBottom: '16px'
                  }}>
                    📅 {formatearFecha(fecha)}
                  </h4>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {citasPorFecha[fecha]
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map((cita) => (
                        <li key={cita.id} style={{
                          border: '1px solid #e5e5e5',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '12px',
                          background: '#fafafa',
                          transition: 'all 0.3s ease'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                              <p style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>
                                <strong>👤 {cita.nombre}</strong>
                              </p>
                              <p style={{ margin: '4px 0', color: '#6b6b6b' }}>
                                <strong>✂️ Servicio:</strong> {cita.servicio}
                              </p>
                              <p style={{ margin: '4px 0', color: '#6b6b6b' }}>
                                <strong>🕐 Hora:</strong> {formatearHora(cita.hora)}
                              </p>
                              <p style={{ margin: '4px 0', color: '#6b6b6b' }}>
                                <strong>📞 Teléfono:</strong> {cita.telefono}
                              </p>
                              {cita.notas && (
                                <p style={{ margin: '8px 0 0', color: '#6b6b6b', fontStyle: 'italic' }}>
                                  <strong>📝 Notas:</strong> {cita.notas}
                                </p>
                              )}
                            </div>
                            <button
                              className="btn outline"
                              onClick={() => eliminarCita(cita.id)}
                              style={{ alignSelf: 'flex-start' }}
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
      )}
    </main>
  );
};

export default Login;