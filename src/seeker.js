import Player from "./player.js";

export default class Seeker extends Player {

    constructor(game, id, velocidade, spawnCoord){
        super(game, id, velocidade, 0.35, spawnCoord);
    }   

    create(){
        super.create()
        this.rt.depth = 10;
    }

    update(button){
        super.update(button);
    }
}
