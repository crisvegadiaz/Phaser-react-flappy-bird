import { variableContaste } from "../scene/config.js";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { useState } from "react";
import "../style/modal.css";

function Modal({ open, game }) {
  const [volume, setVolume] = useState(variableContaste.audio * 100);

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value / 100;
    setVolume(event.target.value);

    const gameScene = game.scene.getScene("game");
    variableContaste.audio = newVolume;

    if (gameScene) {
      if (gameScene.audioGameOver) {
        gameScene.audioGameOver.setVolume(newVolume);
      }
      if (gameScene.audioPixel) {
        gameScene.audioPixel.setVolume(newVolume);
      }
    } else {
      console.error("La escena del juego no existe.");
    }
  };

  const handleGameDestroy = () => {
    game.destroy(true);
  };

  return (
    <dialog open={open}>
      <label htmlFor="volume">
        <AiFillSound /> Volumen {volume}
      </label>
      <input
        type="range"
        id="volume"
        name="volume"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
      />
      <Link to="/" onClick={handleGameDestroy}>
        <FaArrowLeft /> Inicio
      </Link>
    </dialog>
  );
}

export default Modal;
