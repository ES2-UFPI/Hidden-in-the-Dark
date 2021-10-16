import Phaser from 'phaser';
import mapPNG from "./assets/map/assetsmap.png";
import mapJSON from "./assets/map/map.json";
import water from "./assets/map/water.png";
import Hidder from "./hidder.js";
import Seeker from "./seeker.js";
import Chest from "./chest.js";

var keys;
const n = 4;
var keysText;



class Partida extends Phaser.Scene
{

    constructor ()
    {
        super();

        this.player = new Hidder(this, 2, 200);
        this.chests = [];
        for(var i = 0; i < n; i++){
            this.chests.push(new Chest(this, i))
        }
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


        this.player.preload();
        for(var i = 0; i < n; i++){
            this.chests[i].preload();
        }
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
        
        aboveCollider.setDepth(20);

        //player
        

        //criacao das animacoes do player
        this.player.create(300, 200);
        this.physics.add.collider(this.player.player, objectCollider);

        //interação player e chest
        for(var i = 0; i < n; i++){
            var y = 200+100*i;
            this.chests[i].create({'x': 400, 'y': y}, this.player, keys, keysText);
        }
        


        

      
        //fazer a camera seguir o personagem
        const camera = this.cameras.main.setZoom(2);
        camera.startFollow(this.player.player);
        //define limites de alcançe da câmera
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    }


    update(){ 


        button = this.input.keyboard.createCursorKeys();
        this.player.update(button);

        this.scene.launch('hud');

        /*if(keys==5){

        }*/

    }

}
class HUD extends Phaser.Scene{
    create(){
        keysText = this.add.text(16, 16, 'keys: 0', { fontSize: '32px', fill: '#FFFFFF' });
    }
    update(){

    }
}
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [
        new Partida({ key: 'partida'}), // implied { active: true }
        new HUD({ key: 'hud' })
    ],
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