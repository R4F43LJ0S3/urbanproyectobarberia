import React, { useState } from "react";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [logueado, setLogueado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Usuario y clave simulados
    if (usuario === "admin" && clave === "1234") {
      setLogueado(true);
      alert("✅ Bienvenido Administrador");
    } else {
      alert("❌ Usuario o contraseña incorrectos");
    }
  };

  const cerrarSesion = () => {
    setLogueado(false);
    setUsuario("");
    setClave("");
  };

  return (
    <main className="page login-page container">
      {!logueado ? (
        <>
          <h2 className="page-title">Inicio de sesión (Administrador)</h2>
          <form className="card login-form" onSubmit={handleSubmit}>
            <label>
              Usuario:
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </label>
            <label>
              Contraseña:
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </label>
            <button type="submit" className="btn primary">
              Ingresar
            </button>
          </form>
        </>
      ) : (
        <div className="card admin-panel">
          <h2>Panel del Administrador</h2>
          <p>
            Aquí puedes visualizar las citas registradas por los clientes
            (simulación).
          </p>

          <h3>📅 Citas registradas</h3>
          <ul>
            {JSON.parse(localStorage.getItem("citasBarberia") || "[]").map(
              (cita) => (
                <li key={cita.id}>
                  <strong>{cita.nombre}</strong> — {cita.servicio}
                  <br />
                  <small>
                    {cita.fecha} | {cita.hora}
                  </small>
                </li>
              )
            )}
          </ul>

          <button className="btn outline" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </main>
  );
};

export default Login;
