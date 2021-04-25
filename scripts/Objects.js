Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };

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
        percent = percent.clamp(0,1);
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
    constructor(scene, pixelsPerMetre) {
        this.scene = scene;
        this.w = this.scene.game.config.width;
        this.h = this.scene.game.config.height;
        this.pixelsPerMetre = pixelsPerMetre;
        console.log("pixelsPerMetre: " , pixelsPerMetre)

        this.bg1 = this.scene.add.sprite(0, 0, "dustParticles");
        this.bg1.setScale(this.w / this.bg1.width, this.h / this.bg1.height);
        this.bg1.setOrigin(0,0);

        this.bg2 = this.scene.add.sprite(0, this.h, "dustParticles");
        this.bg2.setScale(this.w / this.bg1.width, this.h / this.bg1.height);
        this.bg2.setOrigin(0,0);

        this.speed = 3; //in m/s
    }

    update (time, delta_ms) {
        for (var bg of [this.bg1, this.bg2]) {
            bg.y = bg.y - this.speed*this.pixelsPerMetre*(delta_ms/1000); //m/s * p/m * s
            if (bg.y < -this.h) {
                bg.y = this.h;
            }
            if (bg.y > this.h) {
                bg.y = -this.h;
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
            //frames: this.anims.generateFrameNumbers('swimmer', [5,6, 7, 8,0,1,2,3]),
            frameRate: 9, //set this = the num frames, so 1 loop per second
            repeat: 0
        });
        //var numFrames = this.anims.currentAnim.getTotalFrames()

        // this.anims.play('swim');
        this.anims.timeScale = 0.5;

        this.setScale(2, -2);
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.setTint("0x612d82");
    }

    kick() {
        this.anims.play('swim');
    }

    /*
        this.setAlpha(0);
        this.scene.tweens.add({
          targets: this,
          alpha: 1,
          duration: 250,
          ease: 'Linear',
          repeat: 4,
        });
        */
}
