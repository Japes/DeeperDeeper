var config = {
    type: Phaser.AUTO,
    backgroundColor: 'rgba(76, 199, 224, 1)',
    scale: {
        mode: Phaser.AUTO,
        //parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 400,
        height: 700
    },
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        SceneMainMenu,
        ScenePlay
    ]
};

var game = new Phaser.Game(config);