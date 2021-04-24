class ScenePlay extends Phaser.Scene {
    constructor() {
      super({ key: "ScenePlay" });
    }

    preload ()
    {
    }

    create ()
    {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        this.startTime = undefined; //seems like it's safest to initialise on first update()

        this.progress = this.add.graphics();
        this.progress.setDepth(1000); //"UI layer"

        this.rhythmBar = new RhythmBar(this, 20, 20, this.w - 40, 80);

        /*
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 19 }),
            frameRate: 40,
            repeat: 0
        });
        */

        /*
        this.msgStyle ={ 
            fontSize: 50,
            fontFamily: 'Arial',
            align: "center",
            fill: "#ffffff",
            wordWrap: { width: this.w, height: this.h, useAdvancedWrap: true }
        };
        */

        this.player = new Player(this, this.w * 0.5, this.h * 0.5); 

        /*
        this.time.addEvent({
            delay: 3000,
            callbackScope: this, loop: true,
            callback: function() {
                new Enemy( this, this.w * Phaser.Math.FloatBetween(0, 1), 0);
            }
        });
        */

        //this.setupButtons();

        this.stateGameOver = false;
        this.stateComplete = false;
    }

    update (time, delta)
    {
        //for some reason doing this.time.now in create() doesn't always do what I expect.
        //seems like maybe you need to wait for the first update call, for it to update?
        if(this.startTime == undefined) {
            this.startTime = time;
        } 

        //background
        //this.tilesprite.tilePositionY -= 2/this.tilesprite.scale;

        this.rhythmBar.update(time, delta);

        //progress
        /*
        this.progress.clear();
        this.progress.fillStyle(0x00ff00, 1);
        var percentComplete = (time - this.startTime) / this.levelTimeLimit;
        var progressWidth = 4;
        this.progress.fillRect(this.w - progressWidth, this.h*(1 - percentComplete), 
                                progressWidth, this.h*percentComplete);
        */

        if(time - this.startTime > this.levelTimeLimit && 
            !this.stateGameOver && !this.stateComplete) {
            this.levelComplete();
        }


        /*
        for (var i = 0; i < this.enemies.getChildren().length; i++) {
            var enemy = this.enemies.getChildren()[i];
            enemy.update();
        }
        */

    }

    setupButtons()
    {
        this.retryBtn = new Button(this, this.w * 0.5, this.h * 0.42,
            'retryBtn',  function() { this.scene.scene.start("ScenePlay"); });
        this.retryBtn.enable(false);
        this.retryBtn.setScale(1.2);

        this.lvlCompleteBtn = new TextButton(this, this.w * 0.5, this.h * 0.5,
            "ONWARD!", function() { this.scene.scene.start("SceneSetup"); });
        this.lvlCompleteBtn.enable(false);
    }

    displayMsg(text)
    {
        var winText = this.add.text(this.w/2, this.h/4, text, this.msgStyle);
        winText.setOrigin(0.5);
        winText.setDepth(1000);
    }

    levelComplete()
    {
        if(this.stateGameOver) {
            return;
        }

        this.stateComplete = true;

        this.displayMsg("LEVEL COMPLETE!");

        this.lvlCompleteBtn.enable(true);

        this.player.speedOff();
    }

    gameOver ()
    {
        if(this.stateComplete) {
            return;
        }

        this.displayMsg("GAME OVER :(");

        this.stateGameOver = true;
        this.retryBtn.enable(true);
        this.menuBtn.enable(true);
    }
  }
