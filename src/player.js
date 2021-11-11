
export default class Player {

    constructor(game, id, velocidade,visao, spawnCoord){
        this.game = game;
        this.id = id;
        this.name = 'player_'+id;
        this.caminho = './assets/players/player_'+id+'.png';
        this.velocidade = velocidade;
        this.player = undefined;
        this.spawnCoord = spawnCoord;

        this.prevVelocity = undefined;
        this.prevDir = 'l';
        this.camp_vision = visao;
    }

    preload() {
        this.game.load.spritesheet(this.name, this.caminho, {
            frameWidth: 16,
            frameHeight: 24,
        });
        this.game.load.audio('step', [
            "./assets/sounds/step-sound.mp3"
        ]);
    }

    create (){

        this.player = this.game.physics.add.sprite(this.spawnCoord['x'], this.spawnCoord['y'], this.name);
        //this.player.setCollideWorldBounds(true);
        this.player.depth = 0;
        

        const anims = this.game.anims;
        anims.create({
            key: "walkLeft",
            frames: anims.generateFrameNames(this.name, { start: 19, end: 16 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "walkRight",
            frames: anims.generateFrameNames(this.name, { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1,
        });

        anims.create({
            key: "idleLeft",
            frames: anims.generateFrameNames(this.name, { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "idleRight",
            frames: anims.generateFrameNames(this.name, { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });

        this.player.anims.play("idleRight", true);

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
    }

    update(button){
        this.prevVelocity = this.player.body.velocity.clone();
        this.prevDir = this.player.anims.currentAnim.key.toString()[0];
        
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
            this.player.anims.play("walkLeft", true);
        } else if (button.right.isDown) {
            this.player.anims.play("walkRight", true);
        } else if (button.up.isDown) {
            if (this.prevDir == 'l') this.player.anims.play("walkLeft", true);
            else this.player.anims.play("walkRight", true);
        } else if (button.down.isDown) {
            if (this.prevDir == 'l') this.player.anims.play("walkLeft", true);
            else this.player.anims.play("walkRight", true);
        } else {
            //fazer o boneco voltar a sua animacao de parado depois de parar de andar
            if (this.prevVelocity.x < 0) this.player.anims.play("idleLeft", true);
            else if (this.prevVelocity.x > 0) this.player.anims.play("idleRight", true);
            else if (this.prevVelocity.y < 0) 
                if (this.prevDir == 'l') this.player.anims.play("idleLeft", true);
                else this.player.anims.play("idleRight", true);
            else if (this.prevVelocity.y > 0) 
                if (this.prevDir == 'l') this.player.anims.play("idleLeft", true);
                else this.player.anims.play("idleRight", true);
            
            if (this.prevDir == 'l') this.player.anims.play("idleLeft", true);
            else this.player.anims.play("idleRight", true);
        }
    }

    interactions (chests){
        chests.forEach((c) => {
            this.game.physics.add.collider(this.player, c.chest);
        }); 
    }
}
