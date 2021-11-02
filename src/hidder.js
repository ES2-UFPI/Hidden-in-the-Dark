import Player from "./player.js";

export default class Hidder extends Player {

    constructor(game, id, velocidade){
        super(game, id, velocidade);
        // this.lastChest = null;
    }

    // interactions(chests){
    //     super.interactions(chests);
        
    //     chests.forEach((c) => {//interações com baús
    //         this.game.physics.add.overlap(this.player, c.zone, ()=>{
    //             this.lastChest = c;
    //         });
    //     });
        
    // }

    update(button){

        // if(button.space.isDown){
        //     if (this.lastChest != null && this.game.physics.overlap(this.player, this.lastChest.zone)) {
        //         this.lastChest.open();
        //     }
        // }
        super.update(button);
        
    }
}
