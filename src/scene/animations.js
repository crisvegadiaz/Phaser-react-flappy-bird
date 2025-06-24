export const createAnimations = (game) => {
  const animKey = "pio-fly";

  if (!game.anims.exists(animKey)) {
    game.anims.create({
      key: animKey,
      frames: game.anims.generateFrameNumbers("pio", { start: 0, end: 1 }),
      frameRate: 12,
      repeat: -1,
    });
  }
};
