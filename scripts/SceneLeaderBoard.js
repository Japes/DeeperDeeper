class SceneLeaderBoard extends Phaser.Scene {
    constructor() {
      super({ key: "SceneLeaderBoard" });
    }

    preload ()
    {
    }

    create ()
    {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        this.setupButtons();


        this.scoresJson = "";
        this.haveDisplayed = false;

        let msgStyle ={ 
            fontSize: 20,
            //fontFamily: 'Arial',
            //align: "center",
            fill: "#ffffff",
            //wordWrap: { width: this.w, height: this.h, useAdvancedWrap: false }
        };

        this.boardText = this.add.text(this.w/2, this.h/2, "", msgStyle);
        this.boardText.setOrigin(0.5);

        //hacky way of ensuring that the last submitted score has reached the db
        this.indicatorTimer = this.time.addEvent({
            delay: 500,
            callback: function() {
                this.getHighScores();
            },
            callbackScope: this,
            loop: false
          });
    }
    
    update (time, delta_ms)
    {
        if(this.scoresJson == "") {
            this.boardText.text = "loading...";

        } else if (!this.haveDisplayed) {
            this.boardText.text = "";

            var rank = 1;
            for (var result of this.scoresJson["results"]) {

                let thisRow = rank + ". " 
                while(thisRow.length < 5) {
                    thisRow += " "
                }

                thisRow += result["name"]
                while(thisRow.length < 15) {
                    thisRow += " "
                }

                var score = +(result["score"]);
                thisRow += score.toFixed(2) + "m"

                this.boardText.text += thisRow + "\n"
                rank++;
            }
            
            this.haveDisplayed = true;
        }
    }

    setupButtons()
    {
        /*
        this.retryBtn = new Button(this, this.w * 0.5, this.h * 0.42,
            'retryBtn',  function() { this.scene.scene.start("ScenePlay"); });
        this.retryBtn.enable(false);
        this.retryBtn.setScale(1.2);
        */

        this.retryBtn = new TextButton(this, this.w * 0.5, this.h * 0.925,
            "AGAIN!", function() { this.scene.scene.start("ScenePlay"); });
        this.retryBtn.enable(true);
    }

    getHighScores() {
        
        const Http = new XMLHttpRequest();
        const server='https://jpandaliciawedding.co.za';
        const path='/gamesDatabase/DeeperDeeper/getHighScores.php';
        Http.open("GET", server + path);
        Http.send();

        Http.onreadystatechange = (e) => {
            //console.log('getHighScores http response: ' + Http.responseText)
            if (Http.responseText.length > 0) {
                this.scoresJson = JSON.parse(Http.responseText);
            }
        }
    }
}
