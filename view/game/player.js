const STEP_SOUND_DISTANCE = 600;

export default class Player {
    constructor(game, id, skin, velocidade, visao, spawnCoord, name){
        this.game = game;
        this.id = id;
        this.name = 'player_'+this.id;
        this.skin = skin;
        this.velocidade = velocidade;
        this.player = undefined;
        this.spawnCoord = spawnCoord;

        this.prevVelocity = undefined;
        this.prevDir = 'l';
        this.camp_vision = visao;
        this.playerName = name;
    }

    preload() {
        this.game.skins.iniciarSkin(this.skin);
        this.game.load.audio('step', [
            "./assets/sounds/step-sound.mp3"
        ]);
    }

    create (){
        this.player = this.game.physics.add.sprite(this.spawnCoord['x'], this.spawnCoord['y'], 'player_'+this.skin);
        //this.player.setCollideWorldBounds(true);
        this.player.depth = 0;
        
        this.game.skins.iniciarAnims(this.skin);

        this.player.anims.play("idleRight_"+this.skin, true);

        //fazer o campo de visao do personagem
        this.vision = this.game.make.image({
            x: this.player.x,
            y: this.player.y,
            key: 'fogVision',
            add: false
        });
        //fazendo a mascara que ira deixa ao redor do player sem fog
        this.vision.scale = this.camp_vision;//seeker 0.3 hidder 0.5

        this.step = null;
        
        //fontFamily:  
        this.nameText = this.game.add.text(0, 0, this.playerName, { fontSize: '12px', fill: '#FFFFFF' });
        this.nameText.depth = 21;
        // this.nameText.setScrollFactor(0, 0);
    }

    update(button){
        // if (this.game.PlayerPrincipal != null || !(this.id == this.game.PlayerPrincipal.id)){//personagem controlado pelo sv
        //     return
        // }
        
        //personagem controlado pelo player
        if (!this.game.skins.getAnimStarted(this.skin))return;
        this.prevVelocity = this.player.body.velocity.clone();
        this.prevDir = this.getLastDirection();
        
        //para um player quando ele deixa de apertar um botao de movimento
        this.player.body.setVelocity(0);
        //capturar o botao pressionado
        var velocidade_diagonal = Math.sqrt((this.velocidade**2)*2)/2;
    
        if(this.vision){
            this.vision.x = this.player.x;
            this.vision.y = this.player.y;
	    }

        //qual botao esta sendo pressionado e realiza seu movimento respectivo (setas)
        if(button.left.isDown && button.down.isDown){
            this.player.body.setVelocityX(-velocidade_diagonal);
            this.player.body.setVelocityY(velocidade_diagonal);
        }else if(button.left.isDown && button.up.isDown){
            this.player.body.setVelocityX(-velocidade_diagonal);
            this.player.body.setVelocityY(-velocidade_diagonal);
        }else if(button.right.isDown && button.down.isDown){
            this.player.body.setVelocityX(velocidade_diagonal);
            this.player.body.setVelocityY(velocidade_diagonal);
        }else if(button.right.isDown && button.up.isDown){
            this.player.body.setVelocityX(velocidade_diagonal);
            this.player.body.setVelocityY(-velocidade_diagonal);
        }else if (button.left.isDown) {
            this.player.body.setVelocityX(-this.velocidade);
        } else if (button.right.isDown) {
            this.player.body.setVelocityX(this.velocidade);
        } else if (button.up.isDown) {
            this.player.body.setVelocityY(-this.velocidade);
        } else if (button.down.isDown) {
            this.player.body.setVelocityY(this.velocidade);
        }
        //player.anims.currentAnim.key

        if(this.player.anims.currentAnim.key[0] == 'w' && this.step == null){
            this.step = this.game.sound.add('step');
            this.step.play({
                mute:false,
                loop:true, 
                volume:0.3,
                rate:1,
                detune:0,
                seek:0,
                delay:0
            });
        }
        if(this.step != null && this.player.anims.currentAnim.key[0] == 'i'){
            this.step.destroy();
            this.step=null;
        }
        //fazer a animacao de movimento do boneco correspondente ao botao pressionado
        if (button.left.isDown) {
            this.player.anims.play("walkLeft_"+this.skin, true);
        } else if (button.right.isDown) {
            this.player.anims.play("walkRight_"+this.skin, true);
        } else if (button.up.isDown) {
            if (this.prevDir == 'l') this.player.anims.play("walkLeft_"+this.skin, true);
            else this.player.anims.play("walkRight_"+this.skin, true);
        } else if (button.down.isDown) {
            if (this.prevDir == 'l') this.player.anims.play("walkLeft_"+this.skin, true);
            else this.player.anims.play("walkRight_"+this.skin, true);
        } else {
            //fazer o boneco voltar a sua animacao de parado depois de parar de andar
            if (this.prevVelocity.x < 0) this.player.anims.play("idleLeft_"+this.skin, true);
            else if (this.prevVelocity.x > 0) this.player.anims.play("idleRight_"+this.skin, true);
            else if (this.prevVelocity.y < 0) 
                if (this.prevDir == 'l') this.player.anims.play("idleLeft_"+this.skin, true);
                else this.player.anims.play("idleRight_"+this.skin, true);
            else if (this.prevVelocity.y > 0) 
                if (this.prevDir == 'l') this.player.anims.play("idleLeft_"+this.skin, true);
                else this.player.anims.play("idleRight_"+this.skin, true);
            

            if (this.prevDir == 'l') this.player.anims.play("idleLeft_"+this.skin, true);
            else this.player.anims.play("idleRight_"+this.skin, true);
        }

        //if (this.player.anims.currentAnim.key.toString()[0]=='w'){
        this.game.socket.emit('playerMovement', { x: this.player.x, y: this.player.y, anim: this.player.anims.currentAnim.key.toString()});
        //}
    }

    updatePlayer(data){
        this.nameText.setPosition(this.player.x - (this.playerName.length * 4) , this.player.y - 25);
        this.player.anims.play(data.anim, true);
        this.player.setPosition(data.x, data.y);


        // SOM 
        if(this.game.playerPrincipal==null)return;
        var distancia = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.game.playerPrincipal.player.x, this.game.playerPrincipal.player.y)
        var volume = (distancia > STEP_SOUND_DISTANCE)? 0 : 1-distancia/STEP_SOUND_DISTANCE ;
        if(this.player.anims.currentAnim.key[0] == 'w'){
            if (this.step == null){
                this.step = this.game.sound.add('step');
                this.step.play({
                    mute:false,
                    loop:true, 
                    volume:volume,
                    rate:1,
                    detune:0,
                    seek:0,
                    delay:0
                });
            }
            else {
                this.step.setVolume(volume);
            }
        }
        if(this.step != null && (this.player.anims.currentAnim.key[0] == 'i' || distancia>500)){
            this.step.destroy();
            this.step=null;
        }
    }

    getLastDirection(){ //returns 'l' or 'r'
        if (this.player.anims.currentAnim.key.toString().split('_')[0] == 'idleLeft' || this.player.anims.currentAnim.key.toString().split('_')[0] == 'walkLeft') return 'l';//fixme!! tem que retirar o id do nome da anim
        else return 'r';
    }

    interactions (chests, gates){
        chests.forEach((c) => {
            this.game.physics.add.collider(this.player, c.chest);
        }); 
        gates.forEach((g)=>{
            this.game.physics.add.collider(this.player, g.zone_gate);
        });
    }

    destroy(){
        if (this.player!=null) this.player.destroy()
        if (this.step!=null) this.step.destroy();
        this.step=null;
        if (this.nameText!=null) this.nameText.destroy();
    }
}
