class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imgKey, onclick, context) {
        super(scene, x, y, imgKey);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setDepth(1000); //higher values rendered later
        this.setInteractive();
        //You can also do pointerover, pointerup, etc
        if(context == undefined) {
            context = this;
        }
        this.on("pointerdown", onclick, context);
    }

    enable(show)
    {
        if(show) {
            this.setInteractive();
        } else {
            this.disableInteractive();
        }
        this.setVisible(show);
    }
}

class TextButton extends Button {
    constructor(scene, x, y, text, onclick, context, btnKey) {
        if(btnKey == undefined) {
            btnKey = "btnSprite";
        }
        super(scene, x, y, btnKey, onclick, context);
        this.setScale(1.25, 0.5);

        var style ={ 
            fontSize: 24,
            fontFamily: 'Arial',
            align: "center",
            fill: "#000000",
            wordWrap: { width: this.displayWidth - 50,
                        height: this.displayHeight - 20,
                         useAdvancedWrap: true }
        }

        this.text = this.scene.add.text(this.x, this.y, text, style);
        this.text.setOrigin(0.5);

        this.text.setDepth(1001);
    }

    //todo this feels lame
    enable(show)
    {
        super.enable(show);
        if(this.text == undefined) { return; }
        this.text.setVisible(show);
    }

    setScale(x, y)
    {
        super.setScale(x, y);
        if(this.text == undefined) { return; }
        this.text.setScale(x, y);
    }

    setPosition(x, y)
    {
        super.setPosition(x, y);
        if(this.text == undefined) { return; }
        this.text.setPosition(x, y);
    }
}
