import Hidder from "./hidder.js";
import Seeker from "./seeker.js";
import Chest from "./chest.js";
import Skins from "./skins.js";
import Gate from "./gate.js";
import { CST } from "../CST.js"

export default class Partida extends Phaser.Scene
{
    constructor (socket)
    {
        super({
            key: CST.SCENES.PARTIDA
        });
        this.keys = 0;
        // var n = 12;//quant de baús
        // var locations = getChestLocation();
        // shuffle(locations);

        this.players = [];
        this.playerPrincipal = null;
        //this.player = new Seeker(this, 2, 250);


        this.playeralatorio= new Hidder(this,  10, 3, {'x': 0, 'y': 0}, '');
        this.playeralatorio2= new Hidder(this,  11, 2, {'x': 0, 'y': 0}, '');

        this.skins = new Skins(this);
        this.chests = [];
        this.socket = socket;
        this.gates = []
        this.gates.push(new Gate(this, 1, {x:3136,y:5545}))
        this.gates.push(new Gate(this, 2, {x:1760,y:648}))
    }

    preload (){
        //pre carregando os assets
        this.load.image("tiles", "./assets/map/assetsmap.png");
        //mapa do jogo feito a partir do template de pixels
        this.load.tilemapTiledJSON("map", "./assets/map/map.json");
        //visão do boneco
        this.load.image("fogVision", "./assets/players/view-mask.png");
        //carregando a skin do jogador
        // this.player.preload();

        this.load.audio('theme', [
            "./assets/sounds/musica_de_fundo.mp3"
        ]);
        this.playeralatorio.preload()
        this.playeralatorio2.preload()


        // baus
        this.load.image('chest-zone', './assets/items/chest-zone.png');

        this.load.spritesheet('chest', './assets/items/chest.png', {
            frameWidth: 15,
            frameHeight: 18,
        });

        this.load.audio('chest_open', [
            "./assets/sounds/chest-sound-2.mp3"
        ]);

        this.gates.forEach((gate) =>{gate.preload()});
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
        
        this.gates.forEach((gate) =>{gate.create()});
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

        this.socket.on('currentPlayers', (players)=>(this.createPlayers(players, this)));
        this.socket.on('newPlayer', (player)=>(this.createPlayer(player.playerId, player, this)));
        this.socket.on('playerMoved', (player)=>(this.updatePlayer(player.playerId, player, this)));
        this.socket.on('chests', (chests)=>(this.initChests(chests, this)));
        this.socket.on('openChest', (id)=>(this.openChest(id, this)));
        this.socket.on('desconectado', (id)=>(this.deletePlayer(id, this)));
        this.socket.on('playerKilled', (id)=>(this.killPlayer(id, this)));
        this.socket.emit('ready', {partida: 0, name: localStorage.getItem("playerName")});//id da partida que está entrando

    }

    update(){ 
        var button = this.input.keyboard.createCursorKeys();
        //this.player.update(button);
        if (this.playerPrincipal != null) this.playerPrincipal.update(button);

    }

    /////// CALLBACK

    createPlayer(id, data, game){
        if (game == undefined) return;
        if (game.socket == undefined) return;
        if (id == game.socket.id) {//player principal é carregado
            if (game.playerPrincipal != null) return;//player principal ja foi instanciado
            if (data.team == 'hidder')
                game.playerPrincipal = new Hidder(game,  id, data.skin, {'x': data.x, 'y': data.y},data.name);
            else 
                game.playerPrincipal = new Seeker(game,  id, data.skin, {'x': data.x, 'y': data.y},data.name);
            game.playerPrincipal.preload();
            game.playerPrincipal.create();
            game.physics.add.collider(game.playerPrincipal.player, game.objectCollider);
            game.playerPrincipal.interactions(game.gates, game.chests, game.players);
            game.camera.startFollow(game.playerPrincipal.player); 
            game.rt.mask = new Phaser.Display.Masks.BitmapMask(game, game.playerPrincipal.vision);
            game.rt.mask.invertAlpha = true;
            game.rt.depth = 40;
        }
        else {//outro player
            if (this.getPlayerExists(game, id)) return;//player ja foi instanciado
            if (data.team == 'hidder')
                var p = new Hidder(game, id, data.skin, {'x': data.x, 'y': data.y},data.name);
            else
                var p = new Seeker(game, id, data.skin, {'x': data.x, 'y': data.y},data.name);
            p.preload();
            p.create();
            game.players.push(p);
        }
    }

    killPlayer(id,game){
        game.players.forEach((player) => {
            if (player.id == id){
                player.die();
                return
            }
        });
        if(game.playerPrincipal.id == id){location.reload()}
    }

    createPlayers(players, game){
        for (var indice in players){
            if (players[indice] == null) continue;
            this.createPlayer(players[indice].playerId, players[indice], game)
        }
    }

    updatePlayer(id, data, game){
        for (var indice in game.players){
            if (game.players[indice].id == id)
                game.players[indice].updatePlayer(data);
        }
    }

    openChest(chest, game){
        game.chests[chest].open();
    }

    initChests(chests, game){
        for(var i = 0; i < chests.length; i++){
            game.chests.push(new Chest(game, i, {x: chests[i].x, y: chests[i].y}));
        }
        this.chests.forEach((c)=>{c.preload()});
        this.chests.forEach((c)=>{c.create()});
    }

    /////// UTILIDADES

    getPlayerExists(game, id){
        for (var indice in game.players){
            if (game.players[indice].id == id)
                return true;
        }
        return false;
    }
    
    getPlayerById(game, id){
        for (var indice in game.players){
            if (game.players[indice].id == id)
                return game.players[indice];
        }
        return null;
    }

    deletePlayer(id, game){
        var player = this.getPlayerById(game,id)
        if (player == null) return;
        player.destroy()
        delete game.players[player]
    }

    addKey(){
        this.keys += 1;
        this.keysText.setText('keys: '+this.keys);
    }
}
