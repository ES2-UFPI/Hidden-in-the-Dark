import { CST } from "../CST.js"
export class LoadScene extends Phaser.Scene {
    constructor(){
        super({
            key: CST.SCENES.LOAD
        })
    }
    init(){

    }
    preload(){

    }
    create(){

        this.text = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2,"aguardando partida... " , { fontFamily: 'OCR A Std, monospace' ,fontSize: '46px', fill: '#FFFFFF'}).setOrigin(0.5);
        this.time.delayedCall(2000, goToPlay, null, this);
    }
}

function goToPlay(){
        this.scene.start(CST.SCENES.PARTIDA);
}