class Menu extends Phaser.Scene{
    
    constructor(){
        super({ key: 'Menu', active: false});
    } 

    init(){
        this.CONFIG = this.sys.game.CONFIG;
    }

    create(){

        //Game title
        this.title =  new Text(this, this.CONFIG.centerX, this.CONFIG.centerY, 'Hidden in the dark', 'title');

        //Play
        this.text =  new Text(this, this.CONFIG.centerX, this.CONFIG.centerY, 'Click to play', 'title');

    }

    play(){
        this.scene.start('Play');
    }


}