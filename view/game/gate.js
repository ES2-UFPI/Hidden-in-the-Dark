export default class Gate {

    constructor(game, id, coord){
        this.game = game;
        this.id = id;
        this.coord = coord;
        this.caminho = './assets/gate/gate.png';
        this.name = 'gate-'+this.id;
        this.is_open = false;
    }

    preload() {
    }


}