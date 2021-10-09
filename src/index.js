import Phaser from 'phaser';
import mapPNG from "./assets/map/assetsmap.png";
import mapJSON from "./assets/map/map.json";
import water from "./assets/map/water.png";
import Hidder from "./hidder.js";
import Seeker from "./seeker.js";

import playerImage from "./assets/players/player_2.png";

class Partida extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.player = new Hidder(2, 200);
    }

    preload (){
        //pre carregando os assets
        //fundo png de agua
        this.load.image("background", water);
        //templates de pixels para fazer o mapa
        this.load.image("tiles", mapPNG);
        //mapa do jogo feito a partir do template de pixels
        this.load.tilemapTiledJSON("map", mapJSON);

        //carregando a skin do jogador


        this.player.preload(this);

    }
      
    create (){
        //mapa

        //criando uma key para trabalhar com o map setado no preload
        const map = this.make.tilemap({ key: "map" });
        //tileset que indica as colisões do mapa
        const tileset = map.addTilesetImage("assets", "tiles");

        //colocando no fundo um png de agua
        this.add.image(800, 600, "background");

        //inserindo as camadas do mapa
        //adcionando o chao e suas colisoes
        const ground = map.createLayer("ground", tileset, 0, 0);
        //coisas que colidem com o personagem
        const objectCollider = map.createLayer("objectCollider", tileset, 0, 0);
        //coisas que o personagem passa por baixo
        const aboveCollider = map.createLayer("aboveObject", tileset, 0, 0);

        objectCollider.setCollisionByProperty({ collider: true });
        aboveCollider.setDepth(10);

        //player
        

        //criacao das animacoes do player

        

        this.player.create(this, 300, 200);
        this.physics.add.collider(this.player.player, objectCollider);




        //fazer a camera seguir o personagem
        const camera = this.cameras.main.setZoom(4);
        camera.startFollow(this.player.player);
        //define limites de alcançe da câmera
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update(){ 


        button = this.input.keyboard.createCursorKeys();
        
        this.player.update(this, button);
        

    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Partida,
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
};
var button
var player
const game = new Phaser.Game(config);