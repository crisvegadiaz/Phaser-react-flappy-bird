export const createAnimations = (game) => {
  if (!game.anims.exists("pio-fly")) {
    game.anims.create({
      key: "pio-fly",
      frames: game.anims.generateFrameNumbers("pio", { start: 0, end: 1 }),
      frameRate: 12,
      repeat: -1,
    });
  }
};

