import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { CgMenuGridR } from "react-icons/cg";
import { config } from "../scene/config.js";
import Modal from "../components/Modal";
import Phaser from "phaser";
import "../style/index.css";
import "../style/juego.css";

function Juego() {
  const location = useLocation();
  const [game, setGame] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isGameStarted = Boolean(location.state?.isGameStarted);

  // Maneja la apertura/cierre del diálogo y pausa/reanuda la escena activa
  const handleDialogToggle = useCallback(() => {
    if (!game) return;
    const [activeScene] = game.scene.getScenes(false);
    if (!activeScene) return;

    setIsDialogOpen((prevOpen) => {
      if (prevOpen) {
        activeScene.scene.resume();
      } else {
        activeScene.scene.pause();
      }
      return !prevOpen;
    });
  }, [game]);

  // Inicializa el juego solo una vez cuando está listo para empezar
  useEffect(() => {
    if (isGameStarted && !game) {
      const phaserGame = new Phaser.Game(config);
      setGame(phaserGame);
    }
    // Opcional: limpiar el juego al desmontar el componente
    // return () => { phaserGame?.destroy(true); };
  }, [isGameStarted, game]);

  return (
    <>
      <div id="game">
        <button onClick={handleDialogToggle} aria-label="Abrir menú">
          <CgMenuGridR className="menu" />
        </button>
      </div>
      <Modal open={isDialogOpen} game={game} />
    </>
  );
}

export default Juego;
