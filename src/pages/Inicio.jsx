import { Link } from "react-router-dom";
import "../style/index.css";
import "../style/inicio.css";

const Inicio = () => (
  <div id="inicio">
    <Link
      to="/juego"
      state={{ isGameStarted: true }}
      aria-label="Iniciar el juego"
      className="inicio-link"
    >
      Iniciar
    </Link>
  </div>
);

export default Inicio;
