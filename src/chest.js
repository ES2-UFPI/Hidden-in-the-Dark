

export default class Chest {
    
    constructor(id){
        this.id = id;
        this.caminho = '/src/assets/items/chest.png';
        this.name = 'chest-'+this.id;
        this.open = false;
    }

    preload(preload) {
        preload.load.spritesheet(this.name, this.caminho, {
            frameWidth: 54,
            frameHeight: 54,
        });
    }

    create (create, coord){

        this.chest = create.physics.add.staticSprite(coord['x'], coord['y'], this.name);
        
        const anims = create.anims;

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

    open (){



        //dar chave
    }

}