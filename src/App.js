import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/home";
import Servicios from "./pages/servicios";
import Citas from "./pages/Citas";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 20, minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;


