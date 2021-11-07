import Player from "./player.js";

export default class Seeker extends Player {

    constructor(game, id, velocidade, active){
        super(game, id, velocidade, 0.35, active);
    }   

    create(){
        super.create()
        this.rt.depth = 10;
    }

    update(button){
        if (!this.active) return;
        super.update(button);
    }
}
