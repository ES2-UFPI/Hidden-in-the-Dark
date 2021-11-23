export default class Gate {

    constructor(game, id, coord){
        this.game = game;
        this.id = id;
        this.coord = coord;
        this.caminho = './assets/gate/gate.png';
        this.name = 'gate-'+this.id;
        this.is_open = false
    }

    preload() {
        this.game.load.image(this.name+'-zone', './assets/items/chest-zone.png');
        this.game.load.spritesheet(this.name, this.caminho, {
            frameWidth: 46,
            frameHeight: 59,
        });

        this.game.load.audio('gate_open', [
            "./assets/sounds/gate-sound-1.mp3"
        ]);
    }

    create(){
        this.gate = this.game.physics.add.staticSprite(this.coord['x'], this.coord['y'], this.name);
        
        this.zone_gate = this.game.physics.add.staticImage(this.coord['x'], this.coord['y']+85, this.name+'-zone');
        this.zone_gate.setSize(110,20)
        //this.zone_gate.setDisplaySize(110,10)
        this.zone_gate.setVisible(false);
        
        this.gate.depth = 20;
        this.zone_gate.depth = 20;
        this.gate.setScale(2.9).update();

        const anims = this.game.anims;

        anims.create({
            key: "close_gate",
            frames: anims.generateFrameNames(this.name, { start: 6, end: 6 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "open_gate",
            frames: anims.generateFrameNames(this.name, { start:6, end: 0 }),
            frameRate: 10
        });

        this.gate.anims.play("close_gate", true);
    }

    open(){
        this.gate.anims.play("open_gate", true);
        this.zone_gate.destroy()
        var gate_open = this.game.sound.add('gate_open');
        var gate_open_config={
        mute:false,
        loop:false, 
        volume:0.6,
        rate:1,
        detune:0,
        seek:0,
        delay:0
        };
        gate_open.play(gate_open_config);
    }

}