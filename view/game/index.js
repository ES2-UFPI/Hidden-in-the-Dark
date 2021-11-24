import Partida from "./partida.js";
import {MenuScene} from "./scenes/MenuScene.js"
import {LoadScene} from "./scenes/LoadScene.js"
var socket = io();
var playerName = {};

const config = {
    type: Phaser.WEBGL,
    parent: 'Hidden-in-the-Dark',
    width: 800,
    height: 600,
    scene: [
      new MenuScene(socket, playerName),
      new LoadScene(socket, playerName),
      new Partida(socket)
    ],
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
};



const game = new Phaser.Game(config);
