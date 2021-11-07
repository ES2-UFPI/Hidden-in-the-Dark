
//import CircularProgress from './phaser3-rex-plugins/plugins/circularprogress.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
import Player from "./player.js";


export default class Hidder extends Player {

    constructor(game, id, velocidade, spawnCoord){
        super(game, id, velocidade,0.5, spawnCoord);
        this.lastChest = null;
        this.abrindo = false;
        this.alive = true;
    }

    interactions(chests){
        super.interactions(chests);
        this.circularProgress = undefined;

        
         chests.forEach((c) => {//interações com baús
             this.game.physics.add.overlap(this.player, c.zone, ()=>{
                 this.lastChest = c;
             });
         });
        
     }

    preload (){
        this.game.load.plugin('rexcircularprogressplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcircularprogressplugin.min.js', true);  
        this.game.load.image('red', './src/assets/particles/red.png');
        super.preload();
    }
    
    create(rt){
        super.create()
        rt.depth = 40;
    }

    update(button){
        if(button.space.isDown){//apertando espaço
            if (this.abrindo){//abrindo baú
                if (this.prevDir == 'l') this.player.anims.play("leftIdle", true);
                else this.player.anims.play("rightIdle", true);
                this.player.body.setVelocity(0);
                return;
            }
            if (this.lastChest != null && this.game.physics.overlap(this.player, this.lastChest.zone) && !this.abrindo && !this.lastChest.is_open) {
                this.circularProgress = this.game.add.rexCircularProgress({
                    x: 570, y: 420,
                    radius: 20,
                    trackColor: COLOR_DARK,
                    barColor: COLOR_LIGHT,
                    centerColor: COLOR_PRIMARY,
                    // anticlockwise: true,
                    value: 0, 
                    valuechangeCallback: (newValue, oldValue, circularProgress) => {if (newValue==1) this.abrirBau()}
                    
                })
        
                this.game.tweens.add({
                    targets: this.circularProgress,
                    value: 1,
                    duration: 10000,
                    ease:"Cubic"
                })

                this.circularProgress.setScrollFactor(0, 0);
                this.circularProgress.depth = 50;
                this.abrindo = true;

                //this.lastChest.open();
                this.player.anims.play("leftIdle", true);
                this.player.body.setVelocity(0);
                return;
            }
        } 
        else { //soltou
            if (this.abrindo){
                this.circularProgress.destroy();
                this.abrindo = false;
            }
        }
        super.update(button);
        
    }

    abrirBau(){
        if (this.lastChest != undefined) {
            this.lastChest.open();
            this.abrindo = false;
            this.circularProgress.destroy();
        }
    }

    die(){
        var x = this.player.x
        var y = this.player.y
        this.player.destroy();
        if (this.circularProgress != null) this.circularProgress.destroy();
        this.alive = false;
        var particles = this.game.add.particles('red');
        var emitter = particles.createEmitter();
        emitter.setPosition(x, y);
        emitter.setSpeed(60);
        emitter.setQuantity(1);
        emitter.setScale(0.1);
        emitter.setLifespan(100);
        emitter.setBlendMode(Phaser.BlendModes.ADD);
        function destroyParticle (){
            emitter.manager.emitters.remove(emitter);
        }
        this.game.time.addEvent({
            delay: 1500,                // ms
            callback: destroyParticle,
            //callbackScope: thisArg,
            loop: false
        });
    }

}
