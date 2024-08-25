import Phaser from "phaser";
import pio from "../img/pio.png";
import nube1 from "../img/nube1.svg";
import nube2 from "../img/nube2.svg";
import tubo1 from "../img/tubo1.svg";
import tubo2 from "../img/tubo2.svg";
import pixel from "../music/pixel-arcade.mp3";
import gameOver from "../music/game-over.mp3";
import { variableContaste } from "./config.js";
import { createAnimations } from "./animations.js";

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.puntos = 0;
    this.velocidadTb = -100;
    this.masDificultad = 100;
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.volumeAudio = variableContaste.audio;

    const isMobile = this.winWidth < 768;

    const isTablet = this.winWidth >= 768 && this.winWidth <= 1024;

    if (isMobile) {
      this.scaleTb = 0.8;
      this.sepMin = 150;
      this.scalePio = 0.5;
    } else if (isTablet) {
      this.scaleTb = 1.1;
      this.sepMin = 170;
      this.scalePio = 0.7;
    } else {
      this.scaleTb = 1;
      this.sepMin = 160;
      this.scalePio = 0.6;
    }
  }

  preload() {
    this.load.image("nube1", nube1);
    this.load.image("nube2", nube2);
    this.load.image("tubo1", tubo1);
    this.load.image("tubo2", tubo2);
    this.load.audio("pixel", pixel);
    this.load.audio("game-over", gameOver);
    this.load.spritesheet("pio", pio, { frameWidth: 110, frameHeight: 90 });
  }

  create() {
    createAnimations(this);

    this.audioGameOver = this.sound.add("game-over", {
      volume: this.volumeAudio,
    });
    this.audioPixel = this.sound.add("pixel", { volume: this.volumeAudio });

    this.audioPixel.play({ loop: true });

    this.nube1 = this.physics.add
      .image(0, 0, "nube1")
      .setOrigin(0, 0)
      .setVelocityX(-40);

    this.nube2 = this.physics.add
      .image(250, 567, "nube2")
      .setOrigin(0, 0)
      .setVelocityX(-40);

    this.tubos = this.physics.add.group();

    // Función auxiliar para crear tubos
    const crearTubo = (x, y, texture, originX, originY) => {
      return this.tubos
        .create(x, y, texture)
        .setOrigin(originX, originY)
        .setVelocityX(this.velocidadTb)
        .setImmovable(true)
        .setScale(this.scaleTb)
        .setSize(80, 1250);
    };

    // Crear tubos usando la función auxiliar
    this.tubo1 = crearTubo(0, 0, "tubo1", 0, 1);
    this.tubo2 = crearTubo(0, 0, "tubo2", 0, 0);

    this.randomTB(this.tubo1, this.tubo2);

    if (this.winWidth > 412) {
      this.tubo3 = crearTubo(0, 0, "tubo1", 0, 1);
      this.tubo4 = crearTubo(0, 0, "tubo2", 0, 0);
      this.randomTB(this.tubo3, this.tubo4, 500);
    }

    this.pio = this.physics.add
      .sprite(this.winWidth / 2, this.winHeight / 2, "pio")
      .setCollideWorldBounds(true)
      .setScale(this.scalePio)
      .setCircle(45);

    this.pio.anims.play("pio-fly", true);
    this.pio.body.onWorldBounds = true;

    this.collisionTb = this.physics.add.collider(
      this.pio,
      this.tubos,
      this.collisionObstacle,
      null,
      this
    );

    this.physics.world.on("worldbounds", this.collisionObstacle, this);

    this.puntosTxt = this.add
      .text(30, 10, `Puntos: ${this.puntos} `, {
        fontSize: "30px",
        fill: "#FEF9A7",
        fontFamily: "pixel",
        backgroundColor: "#464141",
        padding: {
          x: 5,
          y: 5,
        },
      })
      .setOrigin(0, 0);

    this.input.on("pointerdown", this.handlePio, this);
  }

  handlePio() {
    if (this.pio.isDead) return;

    this.pio.setGravityY(800);
    this.pio.setVelocityY(-350);

    if (this.pio.isDead) {
      this.input.off("pointerdown", this.handlePio, this);
    }
  }

  collisionObstacle() {
    this.audioPixel.stop();
    this.audioGameOver.play();
    this.deadPio();

    if (this.collisionTb) {
      this.collisionTb.destroy();
      this.collisionTb = null;
    }

    this.time.delayedCall(2000, () => {
      this.add
        .text(this.winWidth / 2, this.winHeight / 2, "Game Over", {
          fontSize: "3rem",
          fill: "#FEF9A7",
          fontFamily: "pixel",
          backgroundColor: "#FF1D38",
          padding: {
            x: this.winWidth,
            y: this.winHeight,
          },
        })
        .setOrigin(0.5);
      this.time.delayedCall(2000, () => {
        this.puntos = 0;
        this.velocidadTb = -100;
        this.masDificultad = 100;
        this.audioGameOver.stop();
        this.scene.restart();
      });
    });
  }

  update() {
    if (
      this.tubo1.x <= -this.tubo1.width &&
      this.tubo2.x <= -this.tubo2.width
    ) {
      this.randomTB(this.tubo1, this.tubo2);
      this.puntosTxt.setText(`Puntos: ${(this.puntos += 10)} `);
      this.velocidad();
    }

    if (
      this.tubo3 &&
      this.tubo4 &&
      this.tubo3.x <= -this.tubo3.width &&
      this.tubo4.x <= -this.tubo4.width
    ) {
      this.randomTB(this.tubo3, this.tubo4);
      this.puntosTxt.setText(`Puntos: ${(this.puntos += 10)} `);
      this.velocidad();
    }

    if (this.nube1.x <= -this.nube1.width) {
      this.nube1.x = this.winWidth;
      this.nube1.y = Math.floor(Math.random() * this.winHeight);
    }

    if (this.nube2.x <= -this.nube2.width) {
      this.nube2.x = this.winWidth;
      this.nube2.y = Math.floor(Math.random() * this.winHeight);
    }
  }

  randomTB(t1, t2, n = 0) {
    t1.x = this.winWidth + n;
    t2.x = this.winWidth + n;

    let numeroAleatorio = Math.floor(Math.random() * this.winHeight);

    let n1 = numeroAleatorio;
    let n2 = numeroAleatorio;

    if (numeroAleatorio > this.winHeight / 2) {
      n1 = n1 - this.sepMin;
    } else if (numeroAleatorio < this.winHeight / 2) {
      n2 = n2 + this.sepMin;
    } else {
      n1 = n1 - this.sepMin / 2;
      n2 = n2 + this.sepMin / 2;
    }

    t1.y = n1;
    t2.y = n2;
  }

  velocidad() {
    if (this.puntos >= this.masDificultad) {
      this.velocidadTb += -50;
      this.masDificultad += 100;
      this.tubos.setVelocityX(this.velocidadTb);
    }
  }

  deadPio() {
    this.pio.setFrame(0);
    this.pio.anims.stop();
    this.pio.isDead = true;
    this.pio.setVelocityX(0);
    this.pio.setVelocityY(0);
    this.pio.setGravityY(800);
    this.pio.setCollideWorldBounds(false);
  }
}
