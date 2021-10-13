import Player from "./player";

export default class Hidder extends Player {

    constructor(id, velocidade){
        super(id, velocidade);
        
    }


    update(button){

        if(button.space.isDown){
            console.log('interação')
        }
        
        super.update(button);
        
    }
}