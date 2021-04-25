class SceneSubmitScore extends Phaser.Scene {
    constructor() {
      super({ key: "SceneSubmitScore" });
    }

    preload ()
    {
    }

    create ()
    {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        this.msgStyle ={ 
            fontSize: 50,
            fontFamily: 'Arial',
            align: "center",
            fill: "#ffffff",
            wordWrap: { width: this.w, height: this.h, useAdvancedWrap: true }
        };

        this.setupButtons();
    }
    
    update (time, delta_ms)
    {

    }

    setupButtons()
    {
        /*
        this.retryBtn = new Button(this, this.w * 0.5, this.h * 0.42,
            'retryBtn',  function() { this.scene.scene.start("ScenePlay"); });
        this.retryBtn.enable(false);
        this.retryBtn.setScale(1.2);
        */

        this.submitBtn = new TextButton(this, this.w * 0.5, this.h * 0.75,
            "submit score", function() { this.submitHighScore( , g_currentScore); });

        this.submitBtn.enable(false);
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
