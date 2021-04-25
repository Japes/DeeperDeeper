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


class InputField {
    constructor(scene, headerText, y) {

        this.scene = scene;

        this.w = this.scene.game.config.width;
        this.h = this.scene.game.config.height;

        this.msgStyle ={ 
            fontSize: 50,
            fontFamily: 'Arial',
            align: "center",
            fill: "#ffffff",
            wordWrap: { width: this.w*0.9, height: this.h, useAdvancedWrap: true }
        };

        this.fieldString = "";
        this.maxLength = 9;
        
        this.headerText = this.scene.add.text(this.w/2, y, headerText, this.msgStyle);
        this.headerText.setOrigin(0.5);

        this.fieldText = this.scene.add.text(this.w*0.05, y + this.headerText.displayHeight/2 + 5, this.fieldString, this.msgStyle);
        this.fieldText.setDepth(10);
        
        var borderWidth = 5;
        this.inputBg = this.scene.add.graphics();
        this.inputBg.fillStyle(0x022ff9, 1);
        this.inputBg.fillRect(this.fieldText.x - borderWidth, this.fieldText.y - borderWidth, 
                                this.w*0.9 + borderWidth*2, this.fieldText.displayHeight + borderWidth*2);

        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyB = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.keyC = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyF = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyG = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.keyH = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.keyI = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.keyJ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.keyK = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keyL = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.keyM = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.keyN = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.keyO = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.keyP = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyR = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.keyU = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
        this.keyV = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyX = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.keyY = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyBack = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        this.setVisible(true);
        this.enabled = true;
    }

    update (time, delta_ms)
    {
        if(!this.enabled) {
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyA)) { this.fieldString += "A"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyB)) { this.fieldString += "B"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyC)) { this.fieldString += "C"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyD)) { this.fieldString += "D"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) { this.fieldString += "E"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyF)) { this.fieldString += "F"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyG)) { this.fieldString += "G"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyH)) { this.fieldString += "H"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyI)) { this.fieldString += "I"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyJ)) { this.fieldString += "J"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyK)) { this.fieldString += "K"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyL)) { this.fieldString += "L"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyM)) { this.fieldString += "M"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyN)) { this.fieldString += "N"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyO)) { this.fieldString += "O"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyP)) { this.fieldString += "P"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyQ)) { this.fieldString += "Q"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyR)) { this.fieldString += "R"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyS)) { this.fieldString += "S"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyT)) { this.fieldString += "T"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyU)) { this.fieldString += "U"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyV)) { this.fieldString += "V"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyW)) { this.fieldString += "W"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyX)) { this.fieldString += "X"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyY)) { this.fieldString += "Y"; }
        if (Phaser.Input.Keyboard.JustDown(this.keyZ)) { this.fieldString += "Z"; }
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)) { this.fieldString += " "; }
        if (Phaser.Input.Keyboard.JustDown(this.keyBack)) { this.fieldString = this.fieldString.slice(0, -1); }

        if (this.fieldString.length > this.maxLength) {
            this.fieldString = this.fieldString.slice(0, this.maxLength - this.fieldString.length);
        }

        this.fieldText.text = this.fieldString;
    }

    getFieldString()
    {
        return this.fieldString;
    }

    setVisible(enable)
    {
        this.enabled = enable;
        this.inputBg.setVisible(enable);
        this.headerText.setVisible(enable);
        this.fieldText.setVisible(enable);
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
