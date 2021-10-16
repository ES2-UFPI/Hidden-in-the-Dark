

export default class Chest {
    
    constructor(game, id){
        this.game = game;
        this.id = id;
        this.caminho = '/src/assets/items/chest.png';
        this.name = 'chest-'+this.id;
        this.open = false;
        this.raio_acao = 100;
    }

    preload() {
        this.game.load.spritesheet(this.name, this.caminho, {
            frameWidth: 54,
            frameHeight: 54,
        });
    }

    create (coord, player){

        this.chest = this.game.physics.add.staticSprite(coord['x'], coord['y'], this.name);

        //this.zone = this.game.add.zone(coord['x'], coord['y'], 100, 100);
        //this.zone.setOrigin(0.5, 0.5);
        // make it a circle
        //this.zone.setCircleDropZone(this.raio_acao);
/*
        this.zone = this.game.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        var circle = new Phaser.Geom.Circle( coord['x'], coord['y'], this.raio_acao);
        this.zone.fillCircleShape(circle);
        this.game.physics.add.existing(this.zone);
*/
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

        
        //this.game.physics.add.collider(player.player, this.chest);
        this.game.physics.add.overlap(player.player, this.chest , ()=>{
            console.log('overlap');
            if(this.open === false){
                this.chest.anims.play('open', true);
                this.open = true;
                //falta dar os pontos
            }
        });
        console.log(this.zone);

    }


}