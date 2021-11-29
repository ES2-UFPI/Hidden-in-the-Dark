import { CST } from "../CST.js"
export class MenuScene extends Phaser.Scene {
    constructor(socket, playerName){
        super({
            key: CST.SCENES.MENU
        })
        this.socket = socket;
        this.playerName = playerName;
    }
    preload(){
        this.load.image("background", "../assets/menu/background.jpeg");
        this.load.image("play", "../assets/menu/playButton.png");
        this.load.audio('main-music', [
            "../assets/sounds/Musica-menu.mp3"
        ]);
    }
    create(){
        this.back = this.add.image(this.game.renderer.width / 2,this.game.renderer.height / 2, "background");
        this.back.setScale(1);

        this.playerName.name = prompt("Por favor, informe seu nome", "name");

        this.name = this.add.text(this.game.renderer.width / 1.9, this.game.renderer.height / 1.5,"Bem-vindo "+ this.playerName.name , { fontFamily: 'OCR A Std, monospace' ,fontSize: '20px', fill: '#FFFFFF'}).setOrigin(0.5);
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

        var background_music = this.sound.add('main-music');
        var background_music_config={
            mute:false,
            loop:true, 
            volume:0.2,
            rate:1,
            detune:0,
            seek:0,
            delay:0
        };
        background_music.play(background_music_config);

    }
}