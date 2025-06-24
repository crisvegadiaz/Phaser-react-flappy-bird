import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx";
import Juego from "./pages/Juego.jsx";
import "./style/index.css";

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/juego" element={<Juego />} />
    </Routes>
  </HashRouter>
);

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<App />);
