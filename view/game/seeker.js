import Player from "./player.js";
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class Seeker extends Player {

    constructor(game, id, velocidade, spawnCoord){
        super(game, id, velocidade, 0.35, spawnCoord);
        this.lastHidder = null;
    }   

    preload(){
        this.game.load.image(this.name+'-hitbox', './assets/items/chest-zone.png');
        this.game.load.audio('hit', [
            "./assets/sounds/hit-knife.mp3"
        ]);
        super.preload()
    }

    interactions(chests, hidders){
        super.interactions(chests);
        
        hidders.forEach((h) => {//interações com baús
            this.game.physics.add.overlap(this.hitbox, h.player, ()=>{
                this.lastHidder = h;
            });
        });
    }

    create(rt){
        super.create()
        this.hitbox = this.game.physics.add.image(this.spawnCoord['x'], this.spawnCoord['y'], this.name+'-hitbox');
        this.hitbox.setScale(0.7);
        this.hitbox.setVisible(false);
        rt.depth = 10;
    }

    update(button){
        this.hitbox.setPosition(this.player.x, this.player.y);
        super.update(button);
        if(button.space.isDown){//apertando espaço
            if (this.cooldown) return; 
            this.hit = this.game.sound.add('hit');
            this.hit.play({
                mute:false,
                loop:false, 
                volume:1,
                rate:1,
                detune:0,
                seek:0,
                delay:0
            });
            this.circularProgress = this.game.add.rexCircularProgress({
                x: 570, y: 420,
                radius: 20,
                trackColor: COLOR_DARK,
                barColor: COLOR_LIGHT,
                centerColor: COLOR_PRIMARY,
                // anticlockwise: true,
                value: 0, 
                valuechangeCallback: (newValue, oldValue, circularProgress) => {if (newValue==1) {this.cooldown = false; circularProgress.destroy()}}
            })
    
            this.game.tweens.add({
                targets: this.circularProgress,
                value: 1,
                duration: 1000,
                ease:"Cubic"
            })

            this.circularProgress.setScrollFactor(0, 0);
            this.circularProgress.depth = 50;
            this.cooldown = true;
            
            if (this.lastHidder!=null && this.game.physics.overlap(this.hitbox, this.lastHidder.player)){//hidder na área
                console.log(this.game.physics.overlap(this.hitbox, this.lastHidder.player));
                this.kill();
            }
        }
    }

    kill(){
        this.lastHidder.die();

    }
}
