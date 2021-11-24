import { CST } from "../CST.js"
export class MenuScene extends Phaser.Scene {
    constructor(socket){
        super({
            key: CST.SCENES.MENU
        })
        this.socket = socket;
    }
    preload(){
        this.load.image("background", "../assets/menu/background.jpeg");
        this.load.image("play", "../assets/menu/playButton.png");
    }
    create(){
        this.back = this.add.image(this.game.renderer.width / 2,this.game.renderer.height / 2, "background");
        this.back.setScale(1);

        var player = prompt("Por favor, informe seu nome", "name");
        localStorage.setItem("playerName", player);

        this.name = this.add.text(this.game.renderer.width / 1.9, this.game.renderer.height / 1.5,"Bem-vindo "+ player , { fontFamily: 'OCR A Std, monospace' ,fontSize: '20px', fill: '#FFFFFF'}).setOrigin(0.5);
        let playButton = this.add.image(this.game.renderer.width / 1.9, this.game.renderer.height / 1.3, "play").setDepth(1).setScale(0.5);

        playButton.setInteractive();

        playButton.on("pointerover", () => {
            playButton.setScale(0.6);

        })

        playButton.on("pointerout", () => {
            playButton.setScale(0.5);
        })
        
        playButton.on("pointerup", () => {
            
            this.scene.start(CST.SCENES.LOAD);
        })

    }
}