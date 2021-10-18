import mapPNG from "./assets/map/assetsmap.png";
import mapJSON from "./assets/map/map.json";
import water from "./assets/map/water.png";
import Hidder from "./hidder.js";
import Seeker from "./seeker.js";
import Chest from "./chest.js";

export default class Partida extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.keys = 0;
        var n = 4;//quant de baús

        this.player = new Hidder(this, 2, 200);
        this.chests = [];
        for(var i = 0; i < n; i++){
            var y = 200+100*i;
            this.chests.push(new Chest(this, i, {'x': 400, 'y': y}));
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
        this.chests.forEach((c)=>{c.preload()});
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
        //this.add.text(10, 10, 'Health: 100', { font: '32px Courier', fill: '#000000' });

        this.score = this.add.text(10, 10, 'keys: ' + this.keys, { font: '32px Courier', fill: '#000000' });
    

        //criacao das animacoes do player
        this.player.create(300, 200);
        this.physics.add.collider(this.player.player, objectCollider);

        //interação player e chest
        this.chests.forEach((c)=>{c.create()});
        
        //adiciona colisões
        this.player.interactions(this.chests)
        
        //fazer a camera seguir o personagem
        const camera = this.cameras.main.setZoom(2);
        camera.startFollow(this.player.player);

        //define limites de alcançe da câmera
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    }


    update(){ 


        var button = this.input.keyboard.createCursorKeys();
        this.player.update(button);

        this.scene.launch('hud', this.keys);
        //this.scene.st


    }

    addKey(){
        this.keys += 1;
    }

}