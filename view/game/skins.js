const frame_data = {
    frameWidth: 16,
    frameHeight: 24,
};

export default class Skins{

    constructor(game){
        this.skin_list = [];
        this.game = game;

    }

    iniciarAnims(id){
        console.log(id)
        var skin = this.getSkinById(id);
        if (skin == null) {
            console.log('skin null');
            return;
        }
        if (this.getAnimStarted(id)) {
            console.log('skin ja iniciada');
            return;
        }
        console.log(id)
        skin.anims_started = true;
        
        const anims = this.game.anims;
        anims.create({
            key: "walkLeft_"+id,
            frames: anims.generateFrameNames('player_'+id, { start: 19, end: 16 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "walkRight_"+id,
            frames: anims.generateFrameNames('player_'+id, { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1,
        });

        anims.create({
            key: "idleLeft_"+id,
            frames: anims.generateFrameNames('player_'+id, { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "idleRight_"+id,
            frames: anims.generateFrameNames('player_'+id, { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });

        
        console.log('skin iniciada agora');

    }

    iniciarSkin(id){
        //if (this.game == undefined) return;
        if (this.getSkinExist(id)) return;
        var skin = {
            name: 'player_'+id,
            id: id,
            caminho: './assets/players/player_'+id+'.png',
            anims_started: false
        }
        this.game.load.spritesheet(skin.name, skin.caminho, frame_data);
        this.skin_list.push(skin);
    }

    getSkinExist(id){
        for (var indice in this.skin_list) if(this.skin_list[indice].id == id) return true;
        return false;
    }

    getAnimStarted(id){
        for (var indice in this.skin_list)
            if(this.skin_list[indice].id == id){
                if (this.skin_list[indice].anims_started) return true;
                else return false;
            }
        return null;
    }

    getSkinById(id){
        for (var indice in this.skin_list) {
            if(this.skin_list[indice].id == id) 
                return this.skin_list[indice];
        }
        return null;
    }
}