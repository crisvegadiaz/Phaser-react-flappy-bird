import { Game } from "./Game.js";

export const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    aotoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  backgroundColor: "#049cd8",
  parent: "game",
  scene: [Game],
};

export let variableContaste = {
  audio: 0.15
}
