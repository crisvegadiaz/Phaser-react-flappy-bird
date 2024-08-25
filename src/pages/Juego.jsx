import { useLocation } from "react-router-dom";
import { CgMenuGridR } from "react-icons/cg";
import { useEffect, useState } from "react";
import { config } from "../scene/config.js";
import Modal from "../components/Modal";
import Phaser from "phaser";
import "../style/index.css";
import "../style/juego.css";

function Juego() {
  const location = useLocation();
  const [game, setGame] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isGameStarted = location.state?.isGameStarted || false;

  const openDialog = () => {
    if (!game) return;
    const activeScene = game.scene.getScenes(false)[0];
    if (!activeScene) return;

    if (isDialogOpen) {
      setIsDialogOpen(false);
      activeScene.scene.resume();
    } else {
      setIsDialogOpen(true);
      activeScene.scene.pause();
    }
  };

  useEffect(() => {
    if (isGameStarted && !game) {
      setGame(new Phaser.Game(config));
    }
  }, [isGameStarted, game]);

  return (
    <>
      <div id="game">
        <button onClick={openDialog}>
          <CgMenuGridR className="menu" />
        </button>
      </div>
      <Modal open={isDialogOpen} game={game} />
    </>
  );
}

export default Juego;
