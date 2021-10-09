import Phaser from 'phaser';
import mapPNG from "./assets/map/assetsmap.png";
import mapJSON from "./assets/map/map.json";
import water from "./assets/map/water.png";

import playerIdle from "./assets/players/Idle_cap.png";
import playerWalk from "./assets/players/Walk_cap.png";

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload (){
        //pre carregando os assets
        //fundo png de agua
        this.load.image("background", water);
        //templates de pixels para fazer o mapa
        this.load.image("tiles", mapPNG);
        //mapa do jogo feito a partir do template de pixels
        this.load.tilemapTiledJSON("map", mapJSON);

        //carregando a skin do jogador
        this.load.spritesheet("playerIdle", playerIdle, {
            frameWidth: 48,
            frameHeight: 48,
        });

        this.load.spritesheet("playerwalk", playerWalk, {
            frameWidth: 48,
            frameHeight: 48,
        });
    }
      
    create (){
        //mapa

        //criando uma key para trabalhar com o map setado no preload
        const map = this.make.tilemap({ key: "map" });
        //tileset que indica as colisões do mapa
        const tileset = map.addTilesetImage("assets", "tiles");

        //colocando no fundo um png de agua
        this.add.image(800, 600, "background");

        //inserindo as camadas do mapa
        //adcionando o chao e suas colisoes
        const ground = map.createLayer("ground", tileset, 0, 0);
        //coisas que colidem com o personagem
        const objectCollider = map.createLayer("objectCollider", tileset, 0, 0);
        //coisas que o personagem passa por baixo
        const aboveCollider = map.createLayer("aboveObject", tileset, 0, 0);

        objectCollider.setCollisionByProperty({ collider: true });
        aboveCollider.setDepth(10);

        //player
        player = this.physics.add.sprite(100, 300, "playerIdle");
        this.physics.add.collider(player, objectCollider);

        //criacao das animacoes do player
        const anims = this.anims;
        anims.create({
            key: "left",
            frames: anims.generateFrameNames("playerwalk", { start: 11, end: 6 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "right",
            frames: anims.generateFrameNames("playerwalk", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "front",
            frames: anims.generateFrameNames("playerwalk", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: "back",
            frames: anims.generateFrameNames("playerwalk", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });


        //fazer a camera seguir o personagem
        const camera = this.cameras.main
        camera.startFollow(player)
        //dar um zoom no personagem
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    }

    update(){ 
        //salvando a velocidade do player para auxiliar na animacao de parada
        const prevVelocity = player.body.velocity.clone();
        //para um player quando ele deixa de apertar um botao de movimento
        player.body.setVelocity(0);
        //capturar o botao pressionado
        button = this.input.keyboard.createCursorKeys();
        
        //qual botao esta sendo pressionado e realiza seu movimento respectivo (setas)
        if(button.left.isDown && button.down.isDown){
            player.body.setVelocityX(-141);
            player.body.setVelocityY(141);
        }else if(button.left.isDown && button.up.isDown){
            player.body.setVelocityX(-141);
            player.body.setVelocityY(-141);
        }else if(button.right.isDown && button.down.isDown){
            player.body.setVelocityX(141);
            player.body.setVelocityY(141);
        }else if(button.right.isDown && button.up.isDown){
            player.body.setVelocityX(141);
            player.body.setVelocityY(-141);
        }else if (button.left.isDown) {
            player.body.setVelocityX(-200);
        } else if (button.right.isDown) {
            player.body.setVelocityX(200);
        } else if (button.up.isDown) {
            player.body.setVelocityY(-200);
        } else if (button.down.isDown) {
            player.body.setVelocityY(200);
        }
        
        //fazer a animacao de movimento do boneco correspondente ao botao pressionado
        if (button.left.isDown) {
            player.anims.play("left", true);
        } else if (button.right.isDown) {
            player.anims.play("right", true);
        } else if (button.up.isDown) {
            player.anims.play("back", true);
        } else if (button.down.isDown) {
            player.anims.play("front", true);
        } else {
            player.anims.stop();
        
            //fazer o boneco voltar a sua animacao de parado depois de parar de andar
            if (prevVelocity.x < 0)player.setTexture("playerIdle", 0);
            else if (prevVelocity.x > 0) player.setTexture("playerIdle", 0);
            else if (prevVelocity.y < 0) player.setTexture("playerIdle", 0);
            else if (prevVelocity.y > 0) player.setTexture("playerIdle", 0);

        }

    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame,
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
};
var button
var player
const game = new Phaser.Game(config);