const PLAYER_QUANT = 4

module.exports = class Partida{

    constructor(){
        this.listaDeEspera = new Map();
        this.status = 'WAITING';//FIXME DEVE SER UM ENUM
    }

    addListaEspera(data, socket){
        var user = {
            name: data.name,
        }
        this.listaDeEspera.set(socket, user);
        this.partidaStarter();
    }

    partidaStarter(){
        if (this.listaDeEspera.size<PLAYER_QUANT) return;
        this.iniciarPartida();

        // var usuariosEntrando = new Map();
        // for (var i in 3)
        //     usuariosEntrando.set(this.listaDeEspera[i])
        // this.iniciarPartida(usuariosEntrando);
    }

    iniciarPartida(){//map com usuarios na lista de espera que vão entrar, falta arrumar na função
        if (this.status == 'RUNNING') return;
        this.status = 'RUNNING'//FIXME
        console.log('Partida '+this.status)

        //BAUS
        this.keys = 0;
        var n = 12;//quant de baús
        var locations = require('./locations/chest-spawn.json');
        this.chests = []
        shuffle(locations);
        for (let l in locations){
            this.chests.push({
                x : locations[l].x,
                y : locations[l].y,
                is_open : false
            })
        }

        // PLAYERS
        this.id_players = new Map(); //map com socket e objeto player
        var sockets = Array.from(this.listaDeEspera.keys());
        var players_ready = 0;

        for (var i = 0; i < PLAYER_QUANT ; i++){
            sockets[i].on('ready',  (data)=>{
                players_ready += 1;
                if (players_ready == PLAYER_QUANT)
                    this.iniciarPlayers(sockets);
            })
        }
        sockets.forEach(s => {
            s.emit('start', {});
        });

   }

    iniciarPlayers(sockets){
        var p_locations = require('./locations/player-spawn.json');
        shuffle(p_locations);
        for (var counter = 0; counter < PLAYER_QUANT-1; counter++){
            this.conectarPlayer({
                    name: this.listaDeEspera.get(sockets[counter]).name,
                    x: p_locations[counter].x,
                    y: p_locations[counter].y,
                    team: 'hidder',
                    skin: '2'
                } , 
                sockets[counter]
            );
        }
        //ultimo (hidder)
        this.conectarPlayer({
                name: this.listaDeEspera.get(sockets[counter]).name,
                x: p_locations[counter].x,
                y: p_locations[counter].y,
                team: 'seeker',
                skin: '3'
            } , 
            sockets[counter]
        );

    }

    conectarPlayer(data, socket){
        var p = {
            name: data.name,
            anim: 'idleLeft_'+data.skin,
            skin: data.skin,
            x: data.x,
            y: data.y,
            playerId: socket.id,
            team: data.team
        }
        this.id_players.set(socket, p);
        socket.emit('chests', this.chests);
        // for (let s in socks){
        //     s.emit('newPlayer', p)
        // }
        socket.emit('currentPlayers', Array.from(this.id_players.values()));
        socket.broadcast.emit('newPlayer', p);
        //for (socket.on())
        socket.on('playerMovement',  (movementData)=>this.playerMovement(movementData, socket));
        socket.on('chestOpen',  (id)=>this.chestOpen(id, socket));
        socket.on('killHidder',  (id)=>this.killHidder(id, socket));
    }

    killHidder(id,socket){
        this.desconectarPlayer(socket)
        socket.broadcast.emit('playerKilled', id);
    }

    desconectarPlayer(socket){
        if (this.id_players == undefined || this.id_players.get(socket) == undefined) return;
        this.id_players.delete(socket);
    }

    playerMovement(movementData, socket){
        if(this.id_players.get(socket) == undefined){return}
        this.id_players.get(socket).x = movementData.x;
        this.id_players.get(socket).y = movementData.y;
        this.id_players.get(socket).anim = movementData.anim;
        socket.broadcast.emit('playerMoved', this.id_players.get(socket));
    }

    //cliente envia 'chestOpen'
    //server devolve 'openChest'
    chestOpen(id, socket){
        if (this.chests[id].is_open) return;
        this.chests[id].is_open = true;
        socket.broadcast.emit('openChest', id);
        //CHECAR SE PARTIDA ACABOU
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