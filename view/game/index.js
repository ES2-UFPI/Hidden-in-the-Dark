import Partida from "./partida.js";
import {MenuScene} from "./scenes/MenuScene.js"

const config = {
    type: Phaser.WEBGL,
    parent: 'Hidden-in-the-Dark',
    width: 800,
    height: 600,
    scene: [
      MenuScene,
      Partida
    ],
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
};

const game = new Phaser.Game(config);