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
        // /this.kick.clear();
        // /if (this.keySpace.isDown)
        // /{
        // /    this.kick.fillStyle(0x00ff00, 1);
        // /    this.kick.fillRect(10, 10, 50, 50);
        // /}
    }
}

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, spriteKey) {
        super(scene, x, y, spriteKey);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);

        this.setData("isDead", false);

        this.setScale(0.5);
        this.speed = 380;
        this.setData("speed", this.speed);
        this.setDepth(100);

        /*
        this.shootTimer = this.scene.time.addEvent({
            delay: 250,
            callback: function() {
                var bullet = new Bullet( this.scene, this.x, this.y, 0, -450);
                this.scene.playerBullets.add(bullet);
            },
            callbackScope: this,
            loop: true
          });
          */

        //this.anims.play('coinSpin', true);
        //this.scene.coins.add(this);
    }

    update () {

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
