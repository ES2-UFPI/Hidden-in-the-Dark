import Partida from "./partida.js";
import {MenuScene} from "./scenes/MenuScene.js"
import {LoadScene} from "./scenes/LoadScene.js"

const config = {
    type: Phaser.WEBGL,
    parent: 'Hidden-in-the-Dark',
    width: 800,
    height: 600,
    scene: [
      MenuScene,
      LoadScene,
      Partida
    ],
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
};

var socket = io();

const game = new Phaser.Game(config);
