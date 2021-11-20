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
        this.scene.start(CST.SCENES.MENU, "Hey");
    }
}