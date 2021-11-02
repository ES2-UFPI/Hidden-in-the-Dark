import Phaser from "./phaser.min.js";

import HUD from "./hud.js";
import Partida from "./partida.js";

const config = {
    type: Phaser.WEBGL,
    parent: 'Hidden-in-the-Dark',
    width: 800,
    height: 600,
    scene: [
        new Partida({ key: 'partida'}),
        new HUD({ key: 'hud'}) // implied { active: true }
    ],
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
};

const game = new Phaser.Game(config);
