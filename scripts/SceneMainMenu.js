class SceneMainMenu extends Phaser.Scene {
    constructor() {
      super({ key: "SceneMainMenu" });
    }

    preload ()
    {
        //progress bar for loading
        var progress = this.add.graphics();
        this.load.on('progress', function (value) {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, 270, 800 * value, 60);
    
        });
        this.load.on('complete', function () { this.scene.scene.start("ScenePlay"); });

        this.load.setBaseURL('assets');
        
        //this.load.image('txtBtn4', 'buttons2/txtBtn4.png');
        this.load.spritesheet('swimmer', 'swimmer4_exported_2.png', { frameWidth: 128, frameHeight: 256 } );
        
        this.load.image('breathIndicator', 'breathIndicator.png');
        this.load.image('maskSprite', 'maskSprite.png');
        this.load.image('dustParticles', 'dustParticles.png');
        this.load.image('dustParticles2', 'dustParticles2.png');
        this.load.image('btnSprite', 'btnSprite.png');
        this.load.image('blackout', 'blackout.png');
        this.load.image('white', 'white.png');

        this.load.audio('ambientLoop', ['underwaterLoop.mp3']);
    }
    
    create ()
    {
        /*
        this.bg = new ScrollingBackground(this);

        this.logoTargetHeight = this.game.config.height * 0.25;
        this.logo = new RainbowLogo(this, this.game.config.width/2, this.game.config.height);

        this.startBtn = new TextButton(this, 
            this.game.config.width * 0.5, this.game.config.height * 0.6,
            "BEGIN!",
            function() {
                this.scene.scene.start("SceneSetup");
              });

        this.startBtn.enable(false);

        this.time.addEvent({
            delay: 3000,
            callbackScope: this, loop: true,
            callback: function() {
                this.startBtn.enable(true);
            }
        });

        this.input.on('pointerdown', this.onTap, this);

        this.logPlaySession();
        */
    }

    /*
    logPlaySession() {
        const user = 'anon'; //todo could add something more interesting here
        //const hash = md5(user + _secretKey); //todo not using this, md5 is not the best anyway

        const Http = new XMLHttpRequest();
        const server='https://jpandaliciawedding.co.za';
        const path='/gamesDatabase/RainbowBlaster/logPlaySession.php';
        const args='?user=' + user;
        Http.open("GET", server + path + args);
        Http.send();

        Http.onreadystatechange = (e) => {
            console.log('logPlaySession http response: ' + Http.responseText)
        }
    }

    onTap() {
        this.logo.setHeight(this.logoTargetHeight);
        this.startBtn.enable(true);
    }
*/
    update ()
    {
        /*
        this.bg.update();
        var speed = 5;
        if(this.logo.getHeight() > this.logoTargetHeight) {
            this.logo.setHeight(this.logo.getHeight() - speed);
        }
        */
    }
}