
export default class Preload extends Phaser.State {

    preload() {

        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
        this.loaderBg.anchor.setTo(0.5);
        this.loaderBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.loaderBar);

        this.load.atlasJSONArray('smallfighter', 'img/spritesheet/smallfighter.png', 'data/spritesheet/smallfighter.json');
        this.load.atlasJSONArray('alien0', 'img/spritesheet/alien1.png', 'data/spritesheet/alien.json');
        this.load.atlasJSONArray('alien1', 'img/spritesheet/alien2.png', 'data/spritesheet/alien.json');
        this.load.atlasJSONArray('alien2', 'img/spritesheet/alien3.png', 'data/spritesheet/alien.json');
        this.load.atlasJSONArray('alien3', 'img/spritesheet/alien4.png', 'data/spritesheet/alien.json');
        this.load.atlasJSONArray('button', 'img/spritesheet/button.png', 'data/spritesheet/button.json');
        this.load.image('logo', 'img/viperlogo.jpg');
        this.load.image('farback', 'img/farback.jpg');
        this.load.image('farback2', 'img/farback2.png');
        this.load.image('farback3', 'img/farback3.png');
        this.load.image('bullet', 'img/bullet.png');
        this.load.image('beam', 'img/beam.png');
        this.load.image('nuke', 'img/nuke.png');
        this.load.image('heal', 'img/heal.png');
        this.load.image('speed', 'img/speed.png');
        this.load.image('power', 'img/power.png');
        this.load.image('particle', 'img/particle.gif');
        this.load.image('healthbar', 'img/healthbar.png');
        this.load.image('hudBg', 'img/hud-bg.png');
        this.load.image('tinystar', 'img/star2.png');

        this.load.audio('play', ['audio/music/play.mp3']);
        this.load.audio('neon', ['audio/music/neon.mp3']);
        this.load.audio('menuMusic', ['audio/music/menu.mp3']);

        this.load.audio('menuOver', ['audio/sound/menu-over.mp3']);
        this.load.audio('menuOut', ['audio/sound/menu-out.mp3']);
        this.load.audio('menuDown', ['audio/sound/menu-click.mp3']);

        this.load.audio('bulletHit', ['audio/sound/bullet-hit.mp3']);
        this.load.audio('enemyShot', ['audio/sound/enemy-shot.wav']);
        this.load.audio('enemyExplosion', ['audio/sound/enemy-explosion.mp3']);
        this.load.audio('playerShot', ['audio/sound/player-shot.mp3']);
        this.load.audio('playerExplosion', ['audio/sound/player-explosion.mp3']);
        this.load.audio('killall', ['audio/sound/killall.wav']);
        this.load.audio('speedup', ['audio/sound/speedup.wav']);

        this.load.audio('gameOver', ['audio/sound/game-over.mp3']);
    }

    create() {
        this.state.start('Menu');
    }

}
