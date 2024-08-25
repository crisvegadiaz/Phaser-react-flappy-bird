import { Link } from "react-router-dom";
import "../style/index.css";
import "../style/inicio.css";

function Inicio() {
  return (
    <div id="inicio">
      <Link
        to="/juego"
        state={{ isGameStarted: true }}
        aria-label="Iniciar el juego"
      >
        Iniciar
      </Link>
    </div>
  );
}

export default Inicio;
