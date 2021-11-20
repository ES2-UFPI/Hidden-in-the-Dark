

module.exports = class Partida{

    constructor(){
        // this.keys = 0;
        // var n = 12;//quant de baús
        // var locations = getChestLocation();
        // shuffle(locations);

        this.players = [];
        this.id_players = new Map();

        // this.skins = new Skins(this);
        // this.chests = [];
        // for(var i = 0; i < n; i++){
        //     this.chests.push(new Chest(this, i, locations[i]));
        // }
    }

    conectarPlayer(data, socket){
        //console.log(socket);
        var p = {
            name: data.name,
            anim: 'idleLeft_2',//FIXME!
            x: 1834,
            y: 527,
            playerId: socket.id,
            team: 'hidder'
        }
        this.players.push(p);
        this.id_players.set(socket.id, p);
        console.log('emitindo eventoo conexao')
        socket.emit('currentPlayers', this.players);
        socket.broadcast.emit('newPlayer', p);

        socket.on('playerMovement',  (movementData) => {
            this.id_players.get(socket.id).x = movementData.x;
            this.id_players.get(socket.id).y = movementData.y;
            this.id_players.get(socket.id).anim = movementData.anim;
            // emit a message to all players about the player that moved
            socket.broadcast.emit('playerMoved', this.id_players.get(socket.id));
        });

        
    }

    getIndiceFromId(id){
        for(var p in this.players) if (this.players[p].playerId == id) return p;
        return null;
    }

    desconectarPlayer(socket){
        delete this.players[this.getIndiceFromId(socket.id)];
        this.id_players.delete(socket.id);
    }


}