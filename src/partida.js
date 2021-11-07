import Hidder from "./hidder.js";
import Seeker from "./seeker.js";
import Chest from "./chest.js";
import { getChestLocation } from "./chest-spawn.js";
export default class Partida extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.keys = 0;
        var n = 10;//quant de baús
        var locations = getChestLocation();
        shuffle(locations);

        this.player = new Hidder(this, 2, 200, {'x': 1834, 'y': 527});
        this.player2 = new Seeker(this, 3, 200, {'x': 1834, 'y': 527});
        //this.player = new Seeker(this, 2, 250);

        this.chests = [];
        for(var i = 0; i < n; i++){
            this.chests.push(new Chest(this, i, locations[i]));
        }
    }

    preload (){
        //pre carregando os assets
        //fundo png de agua
        //templates de pixels para fazer o mapa
        this.load.image("tiles", "./src/assets/map/assetsmap.png");
        //mapa do jogo feito a partir do template de pixels
        this.load.tilemapTiledJSON("map", "./src/assets/map/map.json");
        //visão do boneco
        this.load.image("fogVision", "./src/assets/players/view-mask.png");
        //carregando a skin do jogador
        this.player.preload();
        this.player2.preload();
        this.chests.forEach((c)=>{c.preload()});
    }
      
    create (){
        //mapa

        //criando uma key para trabalhar com o map setado no preload
        const map = this.make.tilemap({ key: "map" });
        //tileset que indica as colisões do mapa
        const tileset = map.addTilesetImage("assetsmap", "tiles");

        //inserindo as camadas do mapa
        //adcionando o chao e suas colisoes
        const ground = map.createLayer("ground", tileset, 0, 0);
        //coisas que colidem com o personagem
        const objectCollider = map.createLayer("objectCollider", tileset, 0, 0);
   

        objectCollider.setCollisionByProperty({ collider: true });
        
        // fazendo a fog
        //pegando o tamanho da tela do jogo
        const width = this.scale.width;
        const height = this.scale.height;

        //criacao das animacoes do player
        this.player.create();
        this.player2.create();
        this.physics.add.collider(this.player.player, objectCollider);
        this.physics.add.collider(this.player2.player, objectCollider);

        //interação player e chest
        this.chests.forEach((c)=>{c.create()});
        
        //adiciona colisões
        this.player.interactions(this.chests);
        this.player2.interactions(this.chests);
        
        //fazer a camera seguir o personagem
        const camera = this.cameras.main.setZoom(2);
        camera.startFollow(this.player2.player);

        //define limites de alcançe da câmera
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.keysText = this.add.text(210, 155, 'keys: '+this.keys, { fontSize: '20px', fill: '#FFFFFF' });
        this.keysText.depth = 50;
        this.keysText.setScrollFactor(0, 0);
    }


    update(){ 
        var button = this.input.keyboard.createCursorKeys();
        //this.player.update(button);
        this.player2.update(button);

    }

    addKey(){
        this.keys += 1;
        this.keysText.setText('keys: '+this.keys);
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
