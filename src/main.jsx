import { HashRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Inicio from "./pages/Inicio.jsx";
import Juego from "./pages/Juego.jsx";
import "./style/index.css";
import React from "react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/juego" element={<Juego />} />
    </Routes>
  </HashRouter>
);
