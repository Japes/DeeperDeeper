class CoinDisplay {
    constructor(scene, x, y) {
        this.scene = scene;
        
        //super hacky way to mix sprites and text...proper way would be 
        //http://sbcgames.io/add-sprites-into-font-as-characters/
        // (or write my own class)
        this.text = this.scene.add.text(x, y, 'C  : ' + 0, 
                        { font: '40px Arial', fill: '#ffffff' });
        this.text.setDepth(1000);

        var s = this.scene.add.sprite(x + 22,y + 24, 'coin');
        s.setDepth(1000);
    }

    setValue(value)
    {
        this.text.setText('C  : ' + value);
    }
}

class CellGrid {
    constructor(scene, numcols, numrows) {
        this.scene = scene;

        this.screenWidth = this.scene.game.config.width;
        this.screenHeight = this.scene.game.config.height;

        //TODO these could become parameters
        this.borderTop = this.screenHeight*0.08;
        this.borderBot = this.screenHeight*0.12;
        this.borderSides = this.screenWidth*0.025;

        var border1 = this.scene.add.sprite(0,0, 'border1');

        var screenHeightMinusBorder = this.screenHeight - (this.borderTop + this.borderBot);
        var screenWidthMinusBorder = this.screenWidth - (this.borderSides + this.borderSides);
        this.borderScaleX = (screenWidthMinusBorder / border1.width) / numcols;
        this.borderScaleY = (screenHeightMinusBorder/ border1.height) / numrows;

        this.borderWidth = border1.width * this.borderScaleX;
        this.borderHeight = border1.height * this.borderScaleY;
        border1.destroy(); //just used to get measurements

        for (var i = 0; i < numcols; i++) {
            for (var j = 0; j < numrows; j++) {
                var s = this.scene.add.sprite(0,0,'border1');
                s.setScale(this.borderScaleX, this.borderScaleY);
                s.setPosition(this.borderSides + (this.borderWidth/2) + (this.borderWidth * i), 
                                this.borderTop + (this.borderHeight/2) + (this.borderHeight *j));
            }
        }
    }

    //adds the sprite s to a cell, 
    //scaling it down from whole screen size to cell size
    addSprite(xCoord, yCoord, s)
    {
        var scaleWidth = this.borderWidth/this.screenWidth;
        var scaleHeight = this.borderHeight/this.screenHeight;
        s.setScale(s.scaleX*scaleWidth, s.scaleY*scaleHeight);
        s.setPosition(this.borderSides + s.x*scaleWidth + (this.borderWidth * xCoord), 
                        this.borderTop + s.y*scaleHeight + (this.borderHeight * yCoord));
    }
}
