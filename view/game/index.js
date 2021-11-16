import Partida from "./partida.js";

const config = {
    type: Phaser.WEBGL,
    parent: 'Hidden-in-the-Dark',
    width: 800,
    height: 600,
    scene: [
        new Partida({ key: 'partida'})
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
