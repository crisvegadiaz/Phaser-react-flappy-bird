import Phaser from "phaser";
import { variableContaste } from "./config.js";
import { createAnimations } from "./animations.js";

const PIO_FRAME = { frameWidth: 110, frameHeight: 90 };
const PIO_CIRCLE_RADIUS = 45;
const PIO_GRAVITY = 800;
const PIO_JUMP_VELOCITY = -350;
const NUBE_VELOCITY = -40;
const TUBO_SIZE = { width: 80, height: 1250 };
const PUNTOS_INCREMENTO = 10;
const GAME_OVER_DELAY = 2000;

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });

    this.puntos = 0;
    this.velocidadTb = -100;
    this.masDificultad = 100;
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.volumeAudio = variableContaste.audio;

    // Configuración responsive
    const { scaleTb, sepMin, scalePio } = this.getResponsiveConfig();
    this.scaleTb = scaleTb;
    this.sepMin = sepMin;
    this.scalePio = scalePio;
  }

  getResponsiveConfig() {
    const width = this.winWidth;
    if (width < 768) {
      return { scaleTb: 0.8, sepMin: 150, scalePio: 0.5 };
    }
    if (width <= 1024) {
      return { scaleTb: 1.1, sepMin: 170, scalePio: 0.7 };
    }
    return { scaleTb: 1, sepMin: 160, scalePio: 0.6 };
  }

  preload() {
    this.load.image("nube1", "/img/nube1.svg", { mipmap: false });
    this.load.image("nube2", "/img/nube2.svg", { mipmap: false });
    this.load.image("tubo1", "/img/tubo1.svg", { mipmap: false });
    this.load.image("tubo2", "/img/tubo2.svg", { mipmap: false });
    this.load.audio("pixel", "/music/pixel-arcade.mp3");
    this.load.audio("game-over", "/music/game-over.mp3");
    this.load.spritesheet("pio", "/img/pio.png", {
      ...PIO_FRAME,
      mipmap: false,
    });
  }

  create() {
    createAnimations(this);

    // Audio
    this.audioGameOver = this.sound.add("game-over", {
      volume: this.volumeAudio,
    });
    this.audioPixel = this.sound.add("pixel", { volume: this.volumeAudio });
    this.audioPixel.play({ loop: true });

    // Nubes
    this.nube1 = this.createNube(0, 0, "nube1");
    this.nube2 = this.createNube(250, 567, "nube2");

    // Tubos
    this.tubos = this.physics.add.group();
    [this.tubo1, this.tubo2] = this.createTubos(0);
    if (this.winWidth > 412) {
      [this.tubo3, this.tubo4] = this.createTubos(500);
    }

    // Pio
    this.pio = this.physics.add
      .sprite(this.winWidth / 2, this.winHeight / 2, "pio")
      .setCollideWorldBounds(true)
      .setScale(this.scalePio)
      .setCircle(PIO_CIRCLE_RADIUS);

    this.pio.anims.play("pio-fly", true);
    this.pio.body.onWorldBounds = true;

    // Colisiones
    this.collisionTb = this.physics.add.collider(
      this.pio,
      this.tubos,
      this.collisionObstacle,
      null,
      this
    );
    this.physics.world.on("worldbounds", this.collisionObstacle, this);

    // Texto de puntos
    this.puntosTxt = this.add
      .text(30, 10, `Puntos: ${this.puntos} `, {
        fontSize: "30px",
        fill: "#FEF9A7",
        fontFamily: "pixel",
        backgroundColor: "#464141",
        padding: { x: 5, y: 5 },
      })
      .setOrigin(0, 0);

    // Input
    this.input.on("pointerdown", this.handlePio, this);
  }

  createNube(x, y, key) {
    return this.physics.add
      .image(x, y, key)
      .setOrigin(0, 0)
      .setVelocityX(NUBE_VELOCITY);
  }

  createTubos(offset = 0) {
    const t1 = this.createTubo(0, 0, "tubo1", 0, 1);
    const t2 = this.createTubo(0, 0, "tubo2", 0, 0);
    this.randomTB(t1, t2, offset);
    return [t1, t2];
  }

  createTubo(x, y, texture, originX, originY) {
    return this.tubos
      .create(x, y, texture)
      .setOrigin(originX, originY)
      .setVelocityX(this.velocidadTb)
      .setImmovable(true)
      .setScale(this.scaleTb)
      .setSize(TUBO_SIZE.width, TUBO_SIZE.height);
  }

  handlePio() {
    if (this.pio.isDead) return;
    this.pio.setGravityY(PIO_GRAVITY);
    this.pio.setVelocityY(PIO_JUMP_VELOCITY);
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

    this.time.delayedCall(GAME_OVER_DELAY, () => {
      this.add
        .text(this.winWidth / 2, this.winHeight / 2, "Game Over", {
          fontSize: "3rem",
          fill: "#FEF9A7",
          fontFamily: "pixel",
          backgroundColor: "#FF1D38",
          padding: { x: this.winWidth, y: this.winHeight },
        })
        .setOrigin(0.5);

      this.time.delayedCall(GAME_OVER_DELAY, () => {
        this.resetGame();
      });
    });
  }

  resetGame() {
    this.puntos = 0;
    this.velocidadTb = -100;
    this.masDificultad = 100;
    this.audioGameOver.stop();
    this.scene.restart();
  }

  update() {
    this.checkTuboReset(this.tubo1, this.tubo2);
    if (this.tubo3 && this.tubo4) {
      this.checkTuboReset(this.tubo3, this.tubo4);
    }
    this.checkNubeReset(this.nube1);
    this.checkNubeReset(this.nube2);
  }

  checkTuboReset(t1, t2) {
    if (t1.x <= -t1.width && t2.x <= -t2.width) {
      this.randomTB(t1, t2);
      this.puntosTxt.setText(`Puntos: ${(this.puntos += PUNTOS_INCREMENTO)} `);
      this.velocidad();
    }
  }

  checkNubeReset(nube) {
    if (nube.x <= -nube.width) {
      nube.x = this.winWidth;
      nube.y = Math.floor(Math.random() * this.winHeight);
    }
  }

  randomTB(t1, t2, n = 0) {
    t1.x = this.winWidth + n;
    t2.x = this.winWidth + n;
    let base = Math.floor(Math.random() * this.winHeight);
    let n1 = base,
      n2 = base;
    if (base > this.winHeight / 2) {
      n1 -= this.sepMin;
    } else if (base < this.winHeight / 2) {
      n2 += this.sepMin;
    } else {
      n1 -= this.sepMin / 2;
      n2 += this.sepMin / 2;
    }
    t1.y = n1;
    t2.y = n2;
  }

  velocidad() {
    if (this.puntos >= this.masDificultad) {
      this.velocidadTb -= 50;
      this.masDificultad += 100;
      this.tubos.setVelocityX(this.velocidadTb);
    }
  }

  deadPio() {
    this.pio.setFrame(0);
    this.pio.anims.stop();
    this.pio.isDead = true;
    this.pio.setVelocity(0, 0);
    this.pio.setGravityY(PIO_GRAVITY);
    this.pio.setCollideWorldBounds(false);
  }
}
