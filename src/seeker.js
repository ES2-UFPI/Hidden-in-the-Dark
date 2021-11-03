import Player from "./player.js";

export default class Seeker extends Player {

    constructor(game, id, velocidade){
        super(game, id, velocidade, 0.35);
    }

}
