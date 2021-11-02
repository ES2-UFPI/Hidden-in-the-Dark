

export default class Chest {
    
    constructor(game, id, coord){
        this.game = game;
        this.id = id;
        this.coord = coord;
        this.caminho = './src/assets/items/chest.png';
        this.name = 'chest-'+this.id;
        this.is_open = false;
    }

    preload() {
        this.game.load.image(this.name+'-zone', './src/assets/items/chest-zone.png');

        this.game.load.spritesheet(this.name, this.caminho, {
            frameWidth: 54,
            frameHeight: 54,
        });
    }

    create (){

        this.chest = this.game.physics.add.staticSprite(this.coord['x'], this.coord['y'], this.name);
        this.zone = this.game.physics.add.staticImage(this.coord['x'], this.coord['y'], this.name+'-zone');

        //this.zone.setScale(1.5).update();

        this.zone.setVisible(false);

        const anims = this.game.anims;

        anims.create({
            key: "close",
            frames: anims.generateFrameNames(this.name, { start: 77, end: 77 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "open",
            frames: anims.generateFrameNames(this.name, { start: 77, end: 81 }),
            frameRate: 10
        });

        this.chest.anims.play("close", true);

    }

    open(){
        if(this.is_open == false){
            this.chest.anims.play('open', true);
            this.is_open = true;
            this.game.addKey();
        }
    }


}
