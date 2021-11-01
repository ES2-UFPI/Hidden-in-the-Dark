
export default class Player {

    constructor(game, id, velocidade){
        this.game = game;
        this.id = id;
        this.name = 'player_'+id;
        this.caminho = '/src/assets/players/player_'+id+'.png';
        this.velocidade = velocidade;
        this.player = undefined;

        this.prevVelocity = undefined;
        this.prevDir = 'l';
        
    }

    preload() {
        this.game.load.spritesheet(this.name, this.caminho, {
            frameWidth: 16,
            frameHeight: 24,
        });
    }

    create (x, y){

        this.player = this.game.physics.add.sprite(x, y, this.name);
        //this.player.setCollideWorldBounds(true);
        this.player.depth = 10;
        

        const anims = this.game.anims;
        anims.create({
            key: "leftWalk",
            frames: anims.generateFrameNames(this.name, { start: 19, end: 16 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "rightWalk",
            frames: anims.generateFrameNames(this.name, { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1,
        });

        anims.create({
            key: "leftIdle",
            frames: anims.generateFrameNames(this.name, { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "rightIdle",
            frames: anims.generateFrameNames(this.name, { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });

        this.player.anims.play("rightIdle", true);
    }

    update(button){

        this.prevVelocity = this.player.body.velocity.clone();
        this.prevDir = this.player.anims.currentAnim.key.toString()[0];
        
        //para um player quando ele deixa de apertar um botao de movimento
        this.player.body.setVelocity(0);
        //capturar o botao pressionado
        var velocidade_diagonal = Math.sqrt((this.velocidade**2)*2)/2;
    
        
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
        //fazer a animacao de movimento do boneco correspondente ao botao pressionado
        if (button.left.isDown) {
            this.player.anims.play("leftWalk", true);
        } else if (button.right.isDown) {
            this.player.anims.play("rightWalk", true);
        } else if (button.up.isDown) {
            if (this.prevDir == 'l') this.player.anims.play("leftWalk", true);
            else this.player.anims.play("rightWalk", true);
        } else if (button.down.isDown) {
            if (this.prevDir == 'l') this.player.anims.play("leftWalk", true);
            else this.player.anims.play("rightWalk", true);
        } else {
            //fazer o boneco voltar a sua animacao de parado depois de parar de andar
            if (this.prevVelocity.x < 0) this.player.anims.play("leftIdle", true);
            else if (this.prevVelocity.x > 0) this.player.anims.play("rightIdle", true);
            else if (this.prevVelocity.y < 0) 
                if (this.prevDir == 'l') this.player.anims.play("leftIdle", true);
                else this.player.anims.play("rightIdle", true);
            else if (this.prevVelocity.y > 0) 
                if (this.prevDir == 'l') this.player.anims.play("leftIdle", true);
                else this.player.anims.play("rightIdle", true);
            
            if (this.prevDir == 'l') this.player.anims.play("leftIdle", true);
            else this.player.anims.play("rightIdle", true);
        }
    }

    interactions (chests){
        chests.forEach((c) => {
            this.game.physics.add.collider(this.player, c.chest);
        });
            
    }

}