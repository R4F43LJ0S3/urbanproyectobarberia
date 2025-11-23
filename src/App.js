import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // ✅ Import agregado
import Home from "./pages/home";
import Servicios from "./pages/servicios";
import Citas from "./pages/Citas";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Pago from "./pages/Pago";
import Barberos from "./pages/Barberos";

function App() {
  return (
    <>
      <ScrollToTop /> {/* ✅ Componente agregado aquí */}
      <Navbar />
      <div style={{ paddingTop: 20, minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/barberos" element={<Barberos />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;