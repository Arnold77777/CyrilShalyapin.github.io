import TextButton from '../extensions/textbutton';

export default class Menu extends Phaser.State {

    create() {
        this.distance = 300;
        this.speed = 6;
        this.star;
        this.texture;

        this.max = 400;
        this.xx = [];
        this.yy = [];
        this.zz = [];

        this.music = this.game.add.audio('menuMusic');

        this.title = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY - 200, '', {
            font: '65px Tahoma',
            fill: '#00ff82',
            align: 'center',
            stroke: '#00ff82',
            strokeThickness: 5
        });
        this.title.anchor.setTo(0.5);
        this.title.setShadow(2, 2, "#fe0063", 2, true, true);

        this.start = new TextButton({
            game: this.game,
            x: this.game.world.centerX+7,
            y: this.game.world.centerY+300,
            asset: 'button',
            overFrame: 2,
            outFrame: 1,
            downFrame: 0,
            upFrame: 1,
            label: 'PLAY',
            style: {
                font: '16px Verdana',
                fill: 'white',
                align: 'center'
            }
        });
        this.logo = this.game.add.tileSprite(0, 0, 800, 1000, 'logo')
        this.star = this.game.make.sprite(0, 0, 'tinystar');
        this.texture = this.game.add.renderTexture(800, 1000, 'texture');

        this.game.add.sprite(0, 0, this.texture);

        for (let i = 0; i < this.max; i++) {
                this.xx[i] = Math.floor(Math.random() * 1000) - 400;
                this.yy[i] = Math.floor(Math.random() * 600) - 300;
                this.zz[i] = Math.floor(Math.random() * 1700) - 100;
            }

        this.btnOverSound = this.add.sound('menuOver');
        this.btnOutSound = this.add.sound('menuOut');
        this.btnDownSound = this.add.sound('menuDown');

        this.start.setOverSound(this.btnOverSound);
        this.start.setOutSound(this.btnOutSound);
        this.start.setDownSound(this.btnDownSound);

        this.start.onInputUp.add(() => {
            this.music.stop();
            this.state.start('Play');

        });

        this.menuPanel = this.add.group();
        this.menuPanel.add(this.title);
        this.menuPanel.add(this.start);

        this.music.loopFull();
    }

    update() {

        this.texture.clear();

        for (let i = 0; i < this.max; i++) {
            let perspective = this.distance / (this.distance - this.zz[i]);
            let x = this.game.world.centerX + this.xx[i] * perspective;
            let y = this.game.world.centerY + this.yy[i] * perspective;

            this.zz[i] += this.speed;

            if (this.zz[i] > 300) {
                this.zz[i] -= 400;
            }

            this.texture.renderXY(this.star, x, y);
        }
    }
}
