const PLAYER_QUANT = 4

module.exports = class Partida{

    constructor(io){
        this.listaDeEspera = new Map();
        this.status = 'WAITING';//FIXME DEVE SER UM ENUM
        this.io = io;
    }

    addListaEspera(data, socket){
        var user = {
            name: data.name,
        }
        this.listaDeEspera.set(socket, user);
        this.showPlayers()
        this.partidaStarter();
    }

    partidaStarter(){
        if (this.listaDeEspera.size<PLAYER_QUANT) return;
        if (this.status == 'RUNNING') return;
        this.iniciarPartida();
    }

    iniciarPartida(){//map com usuarios na lista de espera que vão entrar, falta arrumar na função
        if (this.status == 'RUNNING') return;
        this.status = 'RUNNING'//FIXME
        console.log('Partida '+this.status)

        //BAUS
        this.keys = 0;
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
                    try{
                        this.iniciarPlayers(sockets);
                    } catch{
                        this.abortarPartida()
                    }
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
        socket.emit('currentPlayers', Array.from(this.id_players.values()));
        socket.broadcast.emit('newPlayer', p);
        socket.on('playerMovement',  (movementData)=>this.playerMovement(movementData, socket));
        socket.on('chestOpen',  (id)=>this.chestOpen(id, socket));
        socket.on('killHidder',  (id)=>this.killHidder(id, socket));
        this.showPlayers()
    }

    killHidder(id,socket){
        this.desconectarPlayer(this.getSocketById(id));
        socket.broadcast.emit('playerKilled', id);
    }

    desconectarPlayer(socket){
        this.listaDeEspera.delete(socket);
        if (this.status=='RUNNING') {
            this.id_players.delete(socket);
        }
        this.showPlayers()
        this.acabarPartida();
    }

    playerMovement(movementData, socket){
        if(this.id_players.get(socket) == undefined){return}
        this.id_players.get(socket).x = movementData.x;
        this.id_players.get(socket).y = movementData.y;
        this.id_players.get(socket).anim = movementData.anim;
        socket.broadcast.emit('playerMoved', this.id_players.get(socket));
    }

    chestOpen(id, socket){
        if (this.chests[id].is_open) return;
        this.chests[id].is_open = true;
        this.keys += 1;
        socket.broadcast.emit('openChest', id);
        this.acabarPartida();
    }

    acabarPartida(){//acaba a partida se obedecer as condições
        if (this.status!='RUNNING') return;
        if (this.id_players.size <= 1 || this.keys > 8){//deve terminar partida
            //verificar se existe seeker na partida
            this.status = 'WAITING';
            var sockets = Array.from(this.listaDeEspera.keys());
            sockets.forEach(s=>{
                s.emit('playerKilled', s.id);
            })
            console.log('Partida '+this.status)
            this.partidaStarter();
        }
    }

    abortarPartida(){
        this.status = 'WAITING';
        var sockets = Array.from(this.listaDeEspera.keys());
        sockets.forEach(s=>{
            s.emit('playerKilled', s.id);
        })
        console.log('Partida '+this.status)
        this.partidaStarter();
    }

    showPlayers(){
        if (this.status == 'WAITING')
            console.log('Jogo não iniciado | Players na fila: ' + this.listaDeEspera.size);
        else
            console.log('Players em jogo: '+this.id_players.size+' | Players na fila: ' + this.listaDeEspera.size);
    }

    getSocketById(id){
        var sockets = Array.from(this.listaDeEspera.keys());
        sockets.forEach(s=>{
            if (s.id == id)
                return s;
        })
        return null;
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