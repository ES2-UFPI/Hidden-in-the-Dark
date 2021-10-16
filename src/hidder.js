import Player from "./player";

export default class Hidder extends Player {

    constructor(game, id, velocidade){
        super(game, id, velocidade);
        
    }


    update(button){

        if(button.space.isDown){
            console.log('interação')
        }
        
        super.update(button);
        
    }
}