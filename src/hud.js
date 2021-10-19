


export default class HUD extends Phaser.Scene{
    create(data){
        if (typeof data == 'number') this.keysText = this.add.text(16, 16, 'keys: '+data, { fontSize: '32px', fill: '#FFFFFF' });
        else this.keysText = this.add.text(16, 16, 'keys: 0', { fontSize: '32px', fill: '#FFFFFF' });
    }
}