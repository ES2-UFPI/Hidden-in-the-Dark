import Hidder from "./hidder.js";
import Seeker from "./seeker.js";
import Chest from "./chest.js";
import Skins from "./skins.js";
import { getChestLocation } from "./chest-spawn.js";

export default class Partida extends Phaser.Scene
{
    constructor ()
    {
        
        super();
        this.keys = 0;
        var n = 12;//quant de baús
        var locations = getChestLocation();
        shuffle(locations);

        this.players = [];
        this.playerPrincipal = null;
        //this.player = new Seeker(this, 2, 250);


        this.playeralatorio= new Hidder(this,  10, 3, {'x': 0, 'y': 0});
        this.playeralatorio2= new Hidder(this,  11, 2, {'x': 0, 'y': 0});

        this.skins = new Skins(this);
        this.chests = [];
        for(var i = 0; i < n; i++){
            this.chests.push(new Chest(this, i, locations[i]));
        }
    }

    preload (){
        //pre carregando os assets
        //fundo png de agua
        //templates de pixels para fazer o mapa
        this.load.image("tiles", "./assets/map/assetsmap.png");
        //mapa do jogo feito a partir do template de pixels
        this.load.tilemapTiledJSON("map", "./assets/map/map.json");
        //visão do boneco
        this.load.image("fogVision", "./assets/players/view-mask.png");
        //carregando a skin do jogador
        // this.player.preload();
        this.chests.forEach((c)=>{c.preload()});

        this.load.audio('theme', [
            "./assets/sounds/musica_de_fundo.mp3"
        ]);
        this.playeralatorio.preload()
        this.playeralatorio2.preload()
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
        this.objectCollider = map.createLayer("objectCollider", tileset, 0, 0);
   

        this.objectCollider.setCollisionByProperty({ collider: true });
        
        // fazendo a fog
        // pegando o tamanho da tela do jogo
        // const width = this.scale.width;
        // const height = this.scale.height;

        // fazendo uma textura do tamanho do mapa 
        this.rt = this.make.renderTexture({
            width:4928,
            height:6378
        }, true);
        // preenchedo a textura com preto
        this.rt.fill(0x000000, 1);
        // colocando a textura por cima do chao
        this.rt.draw(ground);
        // setando o preto pra ficar azulado
        this.rt.setTint(0x121212); //050505

        this.playeralatorio.create()
        this.playeralatorio2.create()

        //criacao das animacoes do player
        // this.player.create(rt);
        // this.physics.add.collider(this.player.player, objectCollider);

        //interação player e chest
        this.chests.forEach((c)=>{c.create()});
        
        //adiciona colisões
        // this.player.interactions(this.chests, this.player);
        
        //fazer a camera seguir o personagem
        this.camera = this.cameras.main.setZoom(2);

        //define limites de alcançe da câmera
        this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.keysText = this.add.text(210, 155, 'keys: '+this.keys, { fontSize: '20px', fill: '#FFFFFF' });
        this.keysText.depth = 50;
        this.keysText.setScrollFactor(0, 0);

        
        

        //som
        var background_music = this.sound.add('theme');
        var background_music_config={
            mute:false,
            loop:true, 
            volume:0.1,
            rate:1,
            detune:0,
            seek:0,
            delay:0
        };
        background_music.play(background_music_config);


        this.socket = io();
        this.socket.on('currentPlayers', (players)=>(this.createPlayers(players, this)));
        this.socket.on('newPlayer', (player)=>(this.createPlayer(player.playerId, player, this)));
        this.socket.on('playerMoved', (player)=>(this.updatePlayer(player.playerId, player, this)));
    }


    update(){ 
        var button = this.input.keyboard.createCursorKeys();
        //this.player.update(button);
        if (this.playerPrincipal != null) this.playerPrincipal.update(button);

    }

    addKey(){
        this.keys += 1;
        this.keysText.setText('keys: '+this.keys);
    }

    createPlayer(id, data, game){
        if (game == undefined) return;
        if (game.socket == undefined) return;
        if (id == game.socket.id) {//player principal
            if (game.playerPrincipal != null) return;//player principal ja foi instanciado
            //console.log('achou')
            game.playerPrincipal = new Hidder(game,  id, 2, {'x': 1734, 'y': 527});
            game.playerPrincipal.preload();
            game.playerPrincipal.create();
            game.physics.add.collider(game.playerPrincipal.player, game.objectCollider);
            game.playerPrincipal.interactions(game.chests, game.players);
            game.camera.startFollow(game.playerPrincipal.player); 
            game.rt.mask = new Phaser.Display.Masks.BitmapMask(game, game.playerPrincipal.vision);
            game.rt.mask.invertAlpha = true;
            game.rt.depth = 40;
        }
        else {//outro player
            if (this.getPlayerExists(game, id)) return;//player ja foi instanciado
            var p = new Seeker(game, id, 3, {'x': 1734, 'y': 527});
            p.preload();
            p.create();
            game.players.push(p);
        }
    }

    createPlayers(players, game){
        for (var id in players){
            //console.log(players[id].playerId + ' | ' + game.socket.id);
            this.createPlayer(id, players[id], game);
        }
    }

    updatePlayer(id, data, game){
        for (var indice in game.players){
            if (game.players[indice].id == id)
                game.players[indice].updatePlayer(data);
        }
    }

    getPlayerExists(game, id){
        for (var p in game.players) if (p.id == id) return true;
        return false;
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
