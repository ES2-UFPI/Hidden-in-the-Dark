

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
            frameWidth: 15,
            frameHeight: 18,
        });

        this.game.load.audio('chest_open', [
            "./src/assets/sounds/chest-sound-2.mp3"
        ]);
    }

    create (){

        this.chest = this.game.physics.add.staticSprite(this.coord['x'], this.coord['y'], this.name);
        this.zone = this.game.physics.add.staticImage(this.coord['x'], this.coord['y'], this.name+'-zone');
        this.chest.depth = 20;
        //this.zone.setScale(1.5).update();

        this.zone.setVisible(false);

        const anims = this.game.anims;

        anims.create({
            key: "close",
            frames: anims.generateFrameNames(this.name, { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "open",
            frames: anims.generateFrameNames(this.name, { start:0, end: 2 }),
            frameRate: 10
        });

        this.chest.anims.play("close", true);

    }

    open(){
        if(this.is_open == false){
            this.chest.anims.play('open', true);
            this.is_open = true;
            this.game.addKey();

            var chest_open = this.game.sound.add('chest_open');
            var chest_open_config={
            mute:false,
            loop:false, 
            volume:0.6,
            rate:1,
            detune:0,
            seek:0,
            delay:0
            };
            chest_open.play(chest_open_config);
        }
    }


}
