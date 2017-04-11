import Player from '../prefabs/player';
import Enemy from '../prefabs/enemy';
import HUD from '../prefabs/hud';

export default class Play extends Phaser.State {

    create() {

        this.farback = this.add.tileSprite(0, 0, 800, 2380, 'farback');
        this.farback2 = this.add.tileSprite(0, 0, 800, 2400, 'farback2');
        this.farback3 = this.add.tileSprite(0, 0, 800, 2400, 'farback3');

        this.game.time.slowMotion = 1;

        this.enemies = this.add.group();
        this.enemies.enableBody = true;

        this.player = new Player({
            game: this.game,
            x: this.game.world.centerX,
            y: 0.92 * this.game.world.height,
            health: 100,
            asset: 'smallfighter',
            frame: 1
        });
        this.game.stage.addChild(this.player);

        this.hud = new HUD({
            game: this.game,
            player: this.player
        });

        this.game.input.onDown.add(() => {
            this.game.time.slowMotion = 1;
        });

        this.game.input.onUp.add(() => {
            this.game.time.slowMotion = 3;
        });

        this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.pauseKey.onDown.add(this.pauseGame, this);

        this.musicKey = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.musicKey.onDown.add(this.changeMusic, this);

        this.bulletScale = 0.6;
        this.enemyTime = 0;
        this.enemyInterval = 1.5;
        this.enemyShootTime = 0;
        this.enemyShootInterval = 1.6;
        this.playerShootTime = 0;
        this.playerShootInterval = 0.16;
        this.playerShootDamage = 3;
        this.enemyDropKillTimer = 0;
        this.enemyDropSpeedTimer = 0;
        this.enemyDropHealTimer = 0;
        this.enemyDropPowerTimer = 0;
        this.enemyDropSpeedCounter = 0;

        this.game.time.events.loop(Phaser.Timer.SECOND * 10, () => {
            this.killerDrop();
            this.damageUpDrop();

            if (this.player.health < 100) {
            	this.healerDrop();
            }

            if (this.enemyDropSpeedCounter < 5) {
                this.speedUPDrop();
            }

            if(this.enemyInterval > 0.3 ) {
                this.enemyInterval -= 0.1;
            }
        });

        this.overlayBitmap = this.add.bitmapData(this.game.width, this.game.height);
        this.overlayBitmap.ctx.fillStyle = '#000';
        this.overlayBitmap.ctx.fillRect(0, 0, this.game.width, this.game.height);

        this.overlay = this.add.sprite(0, 0, this.overlayBitmap);
        this.overlay.visible = false;
        this.overlay.alpha = 0.75;

        this.music = this.game.add.audio('play');
        this.music2 = this.game.add.audio('neon');
        this.bulletHitSound = this.add.sound('bulletHit');
        this.enemyExplosionSound = this.add.sound('enemyExplosion');
        this.playerExplosionSound = this.add.sound('playerExplosion');
        this.gameOverSound = this.add.sound('gameOver');
        this.killall = this.add.sound('killall');
        this.speedup = this.add.sound('speedup');
        this.music.loopFull();
        this.music2.loopFull();

        this.game.input.onTap.add(this.changeMusic, this);
        this.musicSwitch = 0;
    }

    update() {

        this.farback.tilePosition.y += 1;
        this.farback2.tilePosition.y += 1.4;
        this.farback3.tilePosition.y += 1.8;

        this.enemyTime += this.game.time.physicsElapsed;
        this.enemyShootTime += this.game.time.physicsElapsed;
        this.playerShootTime += this.game.time.physicsElapsed;

        if (this.enemyTime > this.enemyInterval) {
            this.enemyTime = 0;

            this.createEnemy({
                game: this.game,
                x: this.game.rnd.integerInRange(6, 76) * 10,
                y: 0,
                speed: {
                    x: this.game.rnd.integerInRange(5, 10) * 10 * (Math.random() > 0.5 ? 1 : -1),
                    y: this.game.rnd.integerInRange(5, 10) * 10
                },
                health: 9,
                bulletSpeed: this.game.rnd.integerInRange(10, 20) * 10,
                asset: 'alien' + Math.floor(Math.random()*4)
            });
        }

        if (this.enemyShootTime > this.enemyShootInterval) {
            this.enemyShootTime = 0;
            this.enemies.forEachAlive(enemy => {
            	if (Math.random() > 0.75) {
            		enemy.shoot();
            	}
            });
            if (!this.player.alive) {
                this.game.world.bringToTop(this.overlay);
            }
        }

        if (this.playerShootTime > this.playerShootInterval) {
            this.playerShootTime = 0;
            if (this.player.alive) {
                this.player.shoot();
            }
        }

        this.game.physics.arcade.overlap(this.player.bullets, this.enemies, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies, this.crashEnemy, null, this);
        this.enemies.forEach(enemy =>
            this.game.physics.arcade.overlap(this.player, enemy.bullets, this.hitPlayer, null, this));
        this.enemies.forEach(enemy =>
            enemy.bullets.children.forEach( bullet => {
                if (bullet.key == 'nuke' || bullet.key == 'speed' ||
                	bullet.key == 'heal' || bullet.key == 'power') {
                bullet.angle += 1}
        }));

    }

    createEnemy(data) {
        let enemy = this.enemies.getFirstExists(false);

        if (!enemy) {
            enemy = new Enemy(data);
            this.enemies.add(enemy);
        }
        enemy.reset(data);

    }

    hitEffect(obj, color) {
        let tween = this.game.add.tween(obj);
        let emitter = this.game.add.emitter();
        let emitterPhysicsTime = 0;
        let particleSpeed = 100;
        let maxParticles = 10;
        let colour = obj.tint;

        tween.to({tint: 0xff0000}, 100);
        tween.onComplete.add(() => {
        	if (obj.key == 'smallfighter') {
        		obj.tint = 0xffffff;
        	} else {
        		obj.tint = colour;
        	}
        });
        tween.start();

        emitter.x = obj.x;
        emitter.y = obj.y;
        emitter.gravity = 0;
        emitter.makeParticles('particle');

        if (obj.health <= 0) {
            particleSpeed = 200;
            maxParticles = 40;
            color = 0xff0000;
        }

        emitter.minParticleSpeed.setTo(-particleSpeed, -particleSpeed);
        emitter.maxParticleSpeed.setTo(particleSpeed, particleSpeed);
        emitter.start(true, 500, null, maxParticles);
        emitter.update = () => {
            emitterPhysicsTime += this.game.time.physicsElapsed;
            if(emitterPhysicsTime >= 0.6){
                emitterPhysicsTime = 0;
                emitter.destroy();
            }

        };
        emitter.forEach(particle => particle.tint = color);
        if (!this.player.alive) {
            this.game.world.bringToTop(this.overlay);
        }
    }

    hitEnemy(bullet, enemy) {
        this.bulletHitSound.play("",0,0.5);
        enemy.damage(bullet.health);
        this.hitEffect(enemy, bullet.tint);
        if (!enemy.alive) {
            this.enemyExplosionSound.play("",0,0.5);
            this.hud.updateScore(enemy.maxHealth);
        }
        bullet.kill();
    }

    hitPlayer(player, bullet) {
        if (bullet.key === 'beam') {
            this.bulletHitSound.play("", 0, 0.5);
            player.damage(bullet.health);
            this.hud.updateHealth();
            this.hitEffect(player, bullet.tint);
        }

        if (bullet.key == 'nuke') {
            this.enemies.forEachAlive(enemy => {
            	this.hud.updateScore(enemy.maxHealth);
            	enemy.damage(enemy.health);
            });
            this.enemies.forEach(enemy =>
                enemy.bullets.children.forEach( bullet => {
                	if (bullet.key != 'heal' && bullet.key != 'speed' && bullet.key != 'nuke') {
                		bullet.kill()
                	}
                }));
            this.killall.play();
            this.enemies.forEach(enemy =>
                enemy.bullets.children.forEach( bullet => {
                    if (bullet.key === 'nuke') {
                        enemy.bullets.remove(bullet);
                    }
                }));
        }

        if (bullet.key == 'speed') {
            this.playerShootInterval -= 0.02;
            this.bulletScale +=0.05;
            this.player.bullets.forEach(b => b.scale.setTo(this.bulletScale));
            this.speedup.play();
            this.enemies.forEach(enemy =>
                enemy.bullets.children.forEach( bullet => {
                    if (bullet.key === 'speed') {
                        enemy.bullets.remove(bullet);
                    }
                }));
        }

        if (bullet.key == 'heal') {
        	if (this.player.health < 92) {
        		this.player.health += 8;
        	} else {
        		this.player.health = 100;
        	}
        	this.hud.updateHealth();
            this.speedup.play();
            this.enemies.forEach(enemy =>
                enemy.bullets.children.forEach( bullet => {
                    if (bullet.key === 'heal') {
                        enemy.bullets.remove(bullet);
                    }
                }));
        }

        if (bullet.key == 'power') {
        	this.player.bullets.forEach(bullet => {
        		if (bullet.key == 'bullet') {
        			bullet.health += 2;
        		}
        	});
            this.speedup.play();
            this.enemies.forEach(enemy =>
                enemy.bullets.children.forEach( bullet => {
                    if (bullet.key === 'power') {
                        enemy.bullets.remove(bullet);
                    }
                }));
        }

        if (!player.alive) {
            this.playerExplosionSound.play();
            this.gameOver();
        }
        bullet.kill();
    }

    crashEnemy(player, enemy) {
        player.damage(2);
        enemy.damage(enemy.health);
        this.hitEffect(player);
        this.hitEffect(enemy);
        if (!enemy.alive) {
            this.enemyExplosionSound.play("",0,0.5);
            this.hud.updateScore(enemy.maxHealth);
        }
        this.hud.updateHealth();
        if (!player.alive) {
            this.playerExplosionSound.play();
            this.gameOver();
        }
    }

    killerDrop() {
        this.enemyDropKillTimer++;
        if (this.enemyDropKillTimer === 3) {
            let shooter = this.enemies.children.filter(enemy => 
            	enemy.position.y < this.game.world.height/2)[0];
			shooter.killDrop();
            this.enemyDropKillTimer = 0;
        }
    }

    speedUPDrop() {
        this.enemyDropSpeedTimer++;
        if (this.enemyDropSpeedTimer === 7) {
            this.enemyDropSpeedCounter++;
            let shooter = this.enemies.children.filter(enemy => 
            	enemy.position.y < this.game.world.height/2)[0];
            shooter.speedDrop()
            this.enemyDropSpeedTimer = 0;
        }
    }

    healerDrop() {
        this.enemyDropHealTimer++;
        console.log(this.enemyDropHealTimer);
        if (this.enemyDropHealTimer > 1) {
            let shooter = this.enemies.children.filter(enemy => 
            	enemy.position.y < this.game.world.height/2)[0];
            shooter.healDrop();
            console.log(this.player.health);
            this.enemyDropHealTimer = 0;
        }
    }

    damageUpDrop() {
        this.enemyDropPowerTimer++;
        if (this.enemyDropPowerTimer === 17) {
            let shooter = this.enemies.children.filter(enemy => 
            	enemy.position.y < this.game.world.height/2)[0];
            shooter.powerDrop();
            this.enemyDropPowerTimer = 0;
            if (this.enemyInterval > 0) {
            	this.enemyInterval -= 0.1;
            }
        }
    }

    pauseGame() {
        if (this.pauseKey.isDown) {
            if (!this.game.paused) {
                this.game.paused = true;
                let style = {
                    font: '46px Tahoma',
                    fill: '#00ff82',
                    stroke: '#00ff82',
                    align: 'center'
                };
                this.pauseText = this.game.add.text(this.game.world.centerX - 86, this.game.world.centerY - 150,
                    'PAUSE', style);
                this.pauseText.setShadow(2, 2, "#fe0063", 2, true, true);
            } else {
                this.pauseText.destroy();
                this.game.paused = false;
            }
        }
    }

    changeMusic(pointer, doubleTap) {
	    if (doubleTap) {
	    	this.musicSwitch++;
        	if (this.musicSwitch%2) {
        		this.music.stop();
            	this.music2.play();
        	} else {
        		this.music2.stop();
            	this.music.play();
        	}  
	    }
	}

    gameOver() {
        this.game.time.slowMotion = 5;
        this.overlay.visible = true;
        this.game.world.bringToTop(this.overlay);
        let timer = this.game.time.create(this.game, true);
        let style = {
            font: '26px Tahoma',
            fill: '#00ff82',
            stroke: '#00ff82',
            align: 'center'
        };
        this.scoreText = this.game.add.text(this.game.world.centerX - 86, this.game.world.centerY - 150,
            `Your score: ${this.hud.score*10}`, style);
        this.game.world.bringToTop(this.scoreText);
        timer.add(3000, () => {
            this.music.stop();
            this.gameOverSound.play();
            this.game.state.start('Over');
        })
        timer.start();
    }

}

