import { CST } from "../CST.js"
export class LoadScene extends Phaser.Scene {
    constructor(socket){
        super({
            key: CST.SCENES.LOAD
        })
        this.socket = socket;
        this.in_game = false;
    }
    init(){

    }
    preload(){

    }
    create(){
        console.log(this.socket)
        this.text = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2,"aguardando partida... " , { fontFamily: 'OCR A Std, monospace' ,fontSize: '46px', fill: '#FFFFFF'}).setOrigin(0.5);
        this.socket.on('start', (data)=>goToPlay(data, this));
        this.socket.emit('playerLogin', {
            partida: 0,
            name:localStorage.getItem("playerName")
        });
    }
    

}

function goToPlay(data, that){
    if (that.in_game==true) return;
    that.in_game = true;
    that.scene.start(CST.SCENES.PARTIDA);
}