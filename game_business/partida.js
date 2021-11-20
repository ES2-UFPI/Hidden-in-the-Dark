

module.exports = class Partida{

    constructor(){

        // CHESTS
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
        this.id_players = new Map(); //map com id (socket) e objeto player

    }

    conectarPlayer(data, socket){

        var p = {
            name: data.name,
            anim: 'idleLeft',
            skin: '2',
            x: 1834,
            y: 527,
            playerId: socket.id,
            team: 'hidder'
        }
        this.id_players.set(socket.id, p);
        console.log(this.chests)
        socket.emit('chests', this.chests);
        socket.emit('currentPlayers', Array.from(this.id_players.values()));
        socket.broadcast.emit('newPlayer', p);
        socket.on('playerMovement',  (movementData)=>this.playerMovement(movementData, socket));
        socket.on('chestOpen',  (id)=>this.chestOpen(id, socket));
        
    }

    desconectarPlayer(socket){
        this.id_players.delete(socket.id);
    }

    playerMovement(movementData, socket){
        this.id_players.get(socket.id).x = movementData.x;
        this.id_players.get(socket.id).y = movementData.y;
        this.id_players.get(socket.id).anim = movementData.anim;
        socket.broadcast.emit('playerMoved', this.id_players.get(socket.id));
    }

    //cliente envia 'chestOpen'
    //server devolve 'openChest'
    chestOpen(id, socket){
        if (this.chests[id].is_open) return;
        this.chests[id].is_open = true;
        socket.broadcast.emit('openChest', id);
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