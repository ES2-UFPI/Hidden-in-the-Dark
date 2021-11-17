class Play extends Phaser.Scene{
    
    constructor(){
        super({ key: 'Play', active: false});
    } 

    init(){
        this.CONFIG = this.sys.game.CONFIG;
    }

    create(){

    }

    play(){
        this.scene.start('Play');
    }


}