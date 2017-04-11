export default class Bullet extends Phaser.Sprite {

    constructor({ game, x, y, asset, health }) {
        super(game, x, y, asset);

        this.anchor.setTo(0.5);
        this.scale.setTo(0.8);
        this.health = health;
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
    }
}
