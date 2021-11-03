
//import CircularProgress from './phaser3-rex-plugins/plugins/circularprogress.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
import Player from "./player.js";


export default class Hidder extends Player {

    constructor(game, id, velocidade){
        super(game, id, velocidade,0.5);
        this.lastChest = null;
        this.abrindo = false;
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
        super.preload();
    }
    
    create(x,y){
        super.create(x,y)
        this.rt.depth = 40;
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
                    duration: 10000
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

}
