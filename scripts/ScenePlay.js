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

        //this.rhythmBar = new RhythmBar(this, 20, 20, this.w - 40, 80);
        this.oxygenBar = new OxygenBar(this, 20, 20, this.w - 40, 40);

        this.player = new Player(this, this.w * 0.5, this.h * 0.5); 
        this.bg = new ScrollingBackground(this, (this.player.displayHeight*3/4) / 3); //reference for 1m is 3x the swimmers body
        this.depth = 0;
        this.maxDepth = 0;

        this.speed = 0.3; // m/s

        this.o2lvl = 1; // (fraction of total)/s
        this.oxygenBar.setLevel(this.o2lvl);
        this.o2usage = 0.01; // (fraction of total)/s

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.goingDown = true;
        this.gameOver = false;

        this.inputField = new InputField(this, "Name:", this.h * 0.6);
        this.inputField.setVisible(false);

        this.setupButtons();
        this.setupText();
        
        this.stateGameOver = false;
        this.stateComplete = false;
    }
    
    update (time, delta_ms)
    {
        //this.rhythmBar.update(time, delta_ms);
        this.bg.update(time, delta_ms);
        this.inputField.update();
        var canSubmit = (this.inputField.getFieldString().length > 0);
        this.submitBtn.enable(canSubmit);

        var delta_s = delta_ms/1000;
        
        if (Phaser.Input.Keyboard.JustDown(this.keySpace) && !this.gameOver)
        {
            var kickspeed = 1.5;
            if(this.goingDown) {
                this.speed += kickspeed;
            } else {
                this.speed -= kickspeed;
            }

            this.player.kick();
            this.o2usage += 0.03;
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.keyEnter) && this.goingDown && !this.gameOver)
        {
            //flip manoever...
            this.goingDown = false;
            this.player.setScale(this.player.scaleX, -this.player.scaleY);
        }

        this.checkForEndState();

        // "physics simulation"
        var friction = 0.1 * this.speed*this.speed * delta_s; //decelleration due to friction is proportional to v^2
        if(this.speed > 0) {
            this.speed -= friction;
        } else {
            this.speed += friction;
        }

        if(this.depth <= 0 && !this.goingDown) {
            this.speed = 0;
        }
        this.speed = this.speed.clamp(-100,100);

        this.o2usage -= 0.01 * delta_s; //recovery
        this.o2usage = this.o2usage.clamp(0.01,100); //base oxygen usage

        if(this.depth <= 0 && this.o2lvl > 0) {
            this.o2usage = -0.4; //breathing again
        }

        this.o2lvl -= this.o2usage * delta_s;
        this.depth += this.speed * delta_s;
        this.depth = this.depth.clamp(0,9999999999);

        if(this.depth > this.maxDepth) {
            this.maxDepth = this.depth;
        }
        
        //update visuals
        this.bg.speed = this.speed;
        this.oxygenBar.setLevel(this.o2lvl);

        //log
        this.maxDepthText.text = "max depth: " + this.maxDepth.toFixed(2) + "m";
        this.depthText.text = "depth: " + this.depth.toFixed(2) + "m";
        this.speedText.text = "speed: " + this.speed.toFixed(2) + "m/s";
    }

    checkForEndState()
    {
        if(this.gameOver) {
            return;
        }

        if(!this.goingDown && this.depth <= 0) {
            this.displayMsg("Success!\nYou reached:\n**" + this.maxDepth.toFixed(2) + "m**");
            this.retryBtn.enable(true);
            this.gameOver = true;
            this.inputField.setVisible(true);

        } else if(this.o2lvl <= 0) {
            this.displayMsg("Dive failed...");
            this.retryBtn.enable(true);
            this.gameOver = true;
        }
    }

    setupText()
    {
        this.maxDepthText = this.add.text(this.w/2, this.h/8, "");
        this.maxDepthText.setOrigin(0.5);

        this.depthText = this.add.text(this.w/2, this.h*3.5/4, "");
        this.depthText.setOrigin(0.5);

        this.speedText = this.add.text(this.w/2, this.h*3.7/4, "");
        this.speedText.setOrigin(0.5);
    }

    setupButtons()
    {
        /*
        this.retryBtn = new Button(this, this.w * 0.5, this.h * 0.42,
            'retryBtn',  function() { this.scene.scene.start("ScenePlay"); });
        this.retryBtn.enable(false);
        this.retryBtn.setScale(1.2);
        */
        this.submitBtn = new TextButton(this, this.w * 0.5, this.h * 0.8,
            "submit score", function() { 
                this.submitHighScore(this.inputField.getFieldString(), this.maxDepth); 
                this.scene.start("SceneLeaderBoard");
            }, this);
        this.submitBtn.enable(false);

        this.retryBtn = new TextButton(this, this.w * 0.5, this.h * 0.925,
            "AGAIN!", function() { this.scene.scene.start("ScenePlay"); });
        this.retryBtn.enable(false);
    }

    displayMsg(text)
    {
        let msgStyle ={ 
            fontSize: 60,
            fontFamily: 'Arial',
            align: "center",
            //fill: "#ffffff",
            fill: "#000000",
            wordWrap: { width: this.w, height: this.h, useAdvancedWrap: true }
        };

        var winText = this.add.text(this.w/2, this.h/3, text, msgStyle);
        winText.setOrigin(0.5);
        winText.setDepth(1000);
    }

    submitHighScore(name, score) {
        
        //const hash = md5(user + _secretKey); //todo not using this, md5 is not the best anyway

        const Http = new XMLHttpRequest();
        const server='https://jpandaliciawedding.co.za';
        const path='/gamesDatabase/DeeperDeeper/submitHighScore.php';
        const args='?name=' + name + "&score=" + score;
        Http.open("GET", server + path + args);
        Http.send();

        Http.onreadystatechange = (e) => {
            console.log('submitHighScore http response: ' + Http.responseText)
        }
    }
}
