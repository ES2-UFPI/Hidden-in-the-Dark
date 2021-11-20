import { CST } from "../CST.js"
export class MenuScene extends Phaser.Scene {
    constructor(){
        super({
            key: CST.SCENES.MENU
        })
    }
    init(data){
        console.log(data);
        console.log("ok");
    }
    preload(){
        this.load.image("logo", "../assets/menu/logo.png");
        this.load.image("play", "../assets/menu/playButton.png");
    }
    create(){
        this.tittle = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "logo").setDepth(1);
        this.tittle.setScale(0.3);

        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "play").setDepth(1).setScale(0.2);

        playButton.setInteractive();
        
        playButton.on("pointerup", () => {
            this.scene.start(CST.SCENES.PARTIDA);
        })

    }
}