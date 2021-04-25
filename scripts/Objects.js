class RhythmBar {
    constructor(scene, x, y, width, height) {
        this.scene = scene;

        this.bg = scene.add.graphics();
        this.bg.setDepth(100);
        this.bg.fillStyle(0xa7ccd3, 1);
        this.bg.fillRect(x, y, width, height);

        this.centreline = scene.add.graphics();
        this.centreline.setDepth(110);
        this.centreline.fillStyle(0x000000, 0.5);
        this.centreline.fillRect(x + width/2, y, 1, height);
        
        var mask = scene.add.image(x + width/2, y + height/2, "maskSprite").setVisible(false);
        mask.setScale((width/mask.width),(height/mask.height));
        var bitmask = mask.createBitmapMask();

        this.indicators = []

        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        var speedSet = 0.5; // in width/s
        this.speed = speedSet * width; //in pixels/s
        this.period = 2; //in indicators/s

        //TODO this must change to have variable spped
        this.indicatorTimer = this.scene.time.addEvent({
            delay: this.period*1000,
            callback: function() {
                var indicator = this.scene.add.sprite(x + width*1.2, y + height/2, "breathIndicator");
                indicator.setScale((height/indicator.height) * 0.9);
                indicator.setDepth(105);
                indicator.setMask(bitmask);
                this.indicators.push(indicator);
            },
            callbackScope: this,
            loop: true
          });
    }

    update (time, delta_ms) {
        for (var i of this.indicators) {
            i.x -= (delta_ms/1000)*this.speed;
        }
    }
}

class OxygenBar {
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.bg = scene.add.graphics();
        this.bg.setDepth(100);
        this.bg.fillStyle(0x022ff9, 1);
        this.bg.fillRect(x, y, width, height);

        this.lvl = scene.add.graphics();
        this.lvl.setDepth(101);
        this.lvl.fillStyle(0x02abf9, 1);

        this.percent = 1.0;
        this.setLevel (this.percent);
    }

    setLevel (percent) {
        if(percent < 0) {
            percent = 0;
        }
        if(percent > 1) {
            percent = 1;
        }
        console.log("percent:", percent);
        this.lvl.clear()
        this.lvl.fillStyle(0x02abf9, 1);
        this.lvl.fillRect(this.x+1, this.y+1, (this.width-2) * percent, (this.height-2));
        this.percent = percent;
    }

    getLevel() {
        return this.percent;
    }
}

class BackgroundSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, width, height) {
        super(scene, width/2, height/2, "dustParticles");
        this.scene = scene;
        this.scene.add.existing(this);

        this.setScale(width / this.width, height / this.height);
        this.setOrigin(0,0);
    }
}

class ScrollingBackground {
    constructor(scene) {
        this.scene = scene;
        this.w = this.scene.game.config.width;
        this.h = this.scene.game.config.height;

        this.bg1 = this.scene.add.sprite(0, 0, "dustParticles");
        this.bg1.setScale(this.w / this.bg1.width, this.h / this.bg1.height);
        this.bg1.setOrigin(0,0);

        this.bg2 = this.scene.add.sprite(0, this.h, "dustParticles");
        this.bg2.setScale(this.w / this.bg1.width, this.h / this.bg1.height);
        this.bg2.setOrigin(0,0);

        this.speed = 3; //in screen heights/s
    }

    update (time, delta_ms) {
        for (var bg of [this.bg1, this.bg2]) {
            bg.y = bg.y - this.speed;
            if (bg.y < -this.h) {
                bg.y = this.h;
            }
        }
    }
}


class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "swimmer");
        this.scene = scene;
        this.scene.add.existing(this);

        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNumbers('swimmer', { start: 0, end: 8 }),
            frameRate: 9, //set this = the num frames, so 1 loop per second
            repeat: 0
        });
        //var numFrames = this.anims.currentAnim.getTotalFrames()

        this.anims.play('swim');
        this.anims.timeScale = 0.5;

        this.setScale(2, -2);
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.setTint("0x612d82");
    }

    update (time, delta_ms) {
        if (this.keySpace.isDown)
        {
            this.anims.play('swim');
        }

        //this.anims.timeScale = this.anims.timeScale * 1.001;
        return;
        
        var fingerOffset = 75;
        var dist = Phaser.Math.Distance.Between(this.x, this.y, 
            this.scene.input.activePointer.x, 
            this.scene.input.activePointer.y - fingerOffset);

        if(dist > 10) {
            this.scene.physics.moveTo(this, 
                this.scene.input.activePointer.x,
                this.scene.input.activePointer.y - fingerOffset, this.speed);
        } else {
            this.setVelocity(0,0);
        }
    }

    getHit() {
        if(this.livesDisplay == undefined) {
            this.kill();
        }

        this.setAlpha(0);
        this.scene.tweens.add({
          targets: this,
          alpha: 1,
          duration: 250,
          ease: 'Linear',
          repeat: 4,
        });

        var currentLives = this.livesDisplay.getNumLives();
        currentLives -= 1;
        this.livesDisplay.setNumLives(currentLives);
        if(currentLives < 1) {
            this.kill();
        }
    }

    kill() {
        if (this.shootTimer !== undefined) {
            if (this.shootTimer) {
                this.shootTimer.remove(false);
            }
        }

        var e = this.scene.add.sprite(this.x, this.y);
        e.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            e.destroy();
        });
        e.anims.play('explode', true);

        this.setData("isDead", true);
        this.scene.gameOver();
    }

    //do a victory animation - zoom off up the screen
    speedOff() {
        this.victoryAnim = true;
        //hacky way to disable all collisions with this sprite
        this.setCollideWorldBounds(false);
        this.body.setCircle(0.1, 99999, 99999);
        this.setVelocity(0,-this.speed/2);
        this.setAcceleration(0,-1000);
    }
}
