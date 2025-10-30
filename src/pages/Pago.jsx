import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Pago.css";

const Pago = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const citaData = location.state?.cita;

  const [metodoPago, setMetodoPago] = useState("completo");
  const [procesando, setProcesando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  // Precios de servicios
  const precios = {
    "Corte de Cabello": 25000,
    "Corte de Cabello para Niños": 25000,
    "Tratamiento Reparador Anticaida": 40000,
    "Rapado": 15000,
    "Afeitado de Cabeza": 20000,
    "Alizado de Cabello": 35000,
    "Arreglo de Barba": 25000,
    "Perfilado de Barba": 25000,
    "Afeitado de Barba": 20000,
    "Tintura de Barba": 50000,
  };

  const precioTotal = precios[citaData?.servicio] || 0;
  const montoAPagar = metodoPago === "completo" ? precioTotal : precioTotal * 0.5;

  useEffect(() => {
    if (!citaData) {
      navigate("/citas");
    }
  }, [citaData, navigate]);

  const handlePago = () => {
    setProcesando(true);
    
    // Simular proceso de pago
    setTimeout(() => {
      // Guardar la cita con información de pago
      const nuevaCita = {
        id: Date.now(),
        ...citaData,
        pagado: true,
        metodoPago: metodoPago,
        montoPagado: montoAPagar,
        fechaPago: new Date().toLocaleString('es-CO')
      };

      // Obtener citas existentes y agregar la nueva
      const citasExistentes = JSON.parse(localStorage.getItem("citasBarberia") || "[]");
      citasExistentes.unshift(nuevaCita);
      localStorage.setItem("citasBarberia", JSON.stringify(citasExistentes));

      setProcesando(false);
      setConfirmado(true);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate("/citas");
      }, 3000);
    }, 2000);
  };

  if (!citaData) {
    return null;
  }

  if (confirmado) {
    return (
      <main className="page pago-page container">
        <div className="pago-confirmacion">
          <div className="confirmacion-icon">✅</div>
          <h2>¡Pago Confirmado!</h2>
          <p>Tu reserva ha sido confirmada exitosamente.</p>
          <div className="confirmacion-detalles">
            <p><strong>Servicio:</strong> {citaData.servicio}</p>
            <p><strong>Fecha:</strong> {citaData.fecha}</p>
            <p><strong>Hora:</strong> {citaData.hora}</p>
            <p><strong>Monto pagado:</strong> ${montoAPagar.toLocaleString('es-CO')}</p>
          </div>
          <p className="texto-redireccion">Redirigiendo a tus citas...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page pago-page container">
      <h2 className="page-title">Información de pago</h2>
      <p className="page-subtitle">
        Confirma tu reserva realizando el pago de forma segura
      </p>

      <div className="pago-layout">
        {/* RESUMEN DE LA CITA */}
        <div className="card pago-resumen">
          <h3>📋 Resumen de tu cita</h3>
          <div className="resumen-item">
            <span>Servicio:</span>
            <strong>{citaData.servicio}</strong>
          </div>
          <div className="resumen-item">
            <span>Fecha:</span>
            <strong>{citaData.fecha}</strong>
          </div>
          <div className="resumen-item">
            <span>Hora:</span>
            <strong>{citaData.hora}</strong>
          </div>
          <div className="resumen-item">
            <span>Cliente:</span>
            <strong>{citaData.nombre}</strong>
          </div>
          <div className="resumen-divider"></div>
          <div className="resumen-item total">
            <span>Precio del servicio:</span>
            <strong>${precioTotal.toLocaleString('es-CO')}</strong>
          </div>
        </div>

        {/* MÉTODOS DE PAGO */}
        <div className="card pago-metodos">
          <h3>💳 Método de pago</h3>
          
          <div className="metodo-pago-card nequi-card">
            <div className="nequi-header">
              <span className="nequi-icon">📱</span>
              <div>
                <strong>Pago automático con Nequi</strong>
                <p className="nequi-numero">3015378286</p>
              </div>
            </div>
          </div>

          <div className="opciones-pago">
            <label className="opcion-pago">
              <input
                type="radio"
                name="metodoPago"
                value="completo"
                checked={metodoPago === "completo"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <div className="opcion-contenido">
                <strong>Pago completo</strong>
                <span className="opcion-precio">${precioTotal.toLocaleString('es-CO')}</span>
                <small>Paga el 100% ahora</small>
              </div>
            </label>

            <label className="opcion-pago">
              <input
                type="radio"
                name="metodoPago"
                value="deposito"
                checked={metodoPago === "deposito"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <div className="opcion-contenido">
                <strong>Depósito del 50%</strong>
                <span className="opcion-precio">${(precioTotal * 0.5).toLocaleString('es-CO')}</span>
                <small>Paga la mitad ahora, el resto en la barbería</small>
              </div>
            </label>
          </div>

          <div className="pago-info">
            <div className="info-item">
              <strong>Depósito requerido:</strong>
              <span className="monto-destacado">${montoAPagar.toLocaleString('es-CO')}</span>
            </div>
            <div className="info-item">
              <strong>Duración del turno:</strong>
              <span>45 minutos</span>
            </div>
          </div>

          <div className="alerta-importante">
            <span className="alerta-icon">⚠️</span>
            <div>
              <strong>Importante:</strong> Recibirás una notificación en tu app Nequi para aprobar el pago del {metodoPago === "completo" ? "100" : "50"}%. El proceso es rápido y seguro.
            </div>
          </div>

          <div className="horarios-atencion">
            <h4>⏰ Horarios de atención:</h4>
            <p>Lunes a Domingo: 7:00 AM - 22:00 PM</p>
          </div>

          <button
            className="btn primary btn-pagar"
            onClick={handlePago}
            disabled={procesando}
          >
            {procesando ? (
              <>
                <span className="spinner"></span>
                Procesando pago...
              </>
            ) : (
              `Pagar ${metodoPago === "completo" ? "completo" : "50%"} - $${montoAPagar.toLocaleString('es-CO')}`
            )}
          </button>

          <button
            className="btn outline"
            onClick={() => navigate("/citas")}
            disabled={procesando}
          >
            Cancelar
          </button>
        </div>
      </div>
    </main>
  );
};

export default Pago;