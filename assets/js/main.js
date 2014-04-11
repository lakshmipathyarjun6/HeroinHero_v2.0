
window.onload = function() {


    var game = new Phaser.Game(1024, 600, Phaser.CANVAS, '', { preload: preload, create: create,update: update });

    var speed = 4;

    function preload(){
        Phaser.Canvas.setSmoothingEnabled(game.context,false);
        game.stage.backgroundColor = '#ffffff';
        
        game.load.image("heroin_syringe", 'assets/images/heroinsyringe.png');
        game.load.image("dino", 'assets/images/dino.png');
        game.load.image("player2", 'assets/images/PlayerV2.png');
        game.load.atlasJSONHash('ginger','assets/sprites/playerspriteatlas.png','assets/sprites/playersprite.json');

    }

    function create () {

        heroin_syringe = game.add.sprite(500,100,'heroin_syringe');
        dino = game.add.sprite(500,300,'dino');
        dino.scale.y = .08;
        dino.scale.x = .08;
        player2 = game.add.sprite(100,300,'player2');
        player = game.add.sprite(0,200,'ginger');
        player.scale.x = .2;
        player.scale.y = .2;
        player.animations.add('walk');
        player.animations.play('walk',10,true);

    }


    function update(){

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            player.x -= speed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            player.x += speed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            player.y -= speed;
            player.x -= speed/3;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            player.y += speed;
            player.x += speed/3;
        }
    }



};


