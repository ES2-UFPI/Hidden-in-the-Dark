import Hidder from "./hidder.js";
import Seeker from "./seeker.js";
import Chest from "./chest.js";
//import ChestSpanw from "./assets/locations/chest-spawn.json";

export default class Partida extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.keys = 0;
        var n = 4;//quant de baús

        // var locations = require("./assets/locations/chest-spawn.json")
        // shuffle(locations)

        this.player = new Hidder(this, 2, 200);
        // this.chests = [];
        // for(var i = 0; i < n; i++){
        //     this.chests.push(new Chest(this, i, locations[i]));
        // }

    }

    preload (){
        //pre carregando os assets
        //fundo png de agua
        //templates de pixels para fazer o mapa
        this.load.image("tiles", "./src/assets/map/assetsmap.png");
        //mapa do jogo feito a partir do template de pixels
        this.load.tilemapTiledJSON("map", "./src/assets/map/map.json");

        //carregando a skin do jogador
        this.player.preload();
        // this.chests.forEach((c)=>{c.preload()});
    }
      
    create (){
        //mapa

        //criando uma key para trabalhar com o map setado no preload
        const map = this.make.tilemap({ key: "map" });
        //tileset que indica as colisões do mapa
        const tileset = map.addTilesetImage("assetsmap", "tiles");

        //colocando no fundo um png de agua
        //this.add.image(4928, 6368, "background");

        //inserindo as camadas do mapa
        //adcionando o chao e suas colisoes
        const ground = map.createLayer("ground", tileset, 0, 0);
        //coisas que colidem com o personagem
        const objectCollider = map.createLayer("objectCollider", tileset, 0, 0);
   

        objectCollider.setCollisionByProperty({ collider: true });
    

        //criacao das animacoes do player
        this.player.create(1834, 527);
        this.physics.add.collider(this.player.player, objectCollider);

        //interação player e chest
        // this.chests.forEach((c)=>{c.create()});
        
        //adiciona colisões
        // this.player.interactions(this.chests)
        
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
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
