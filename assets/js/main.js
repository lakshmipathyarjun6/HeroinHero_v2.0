
window.onload = function() {


    var game = new Phaser.Game(1024, 600, Phaser.CANVAS, '', { preload: preload, create: create,update: update });

    var player;
    var speed = 4;

    function preload(){
        Phaser.Canvas.smoothEdgesEnabled = false;
        game.stage.backgroundColor = '#ffffff';

        game.load.atlasJSONHash('ginger','assets/sprites/playerspriteatlas.png','assets/sprites/playersprite.json');

    }

        function create () {

        //game.add.sprite(0,0,'bg');

        player = game.add.sprite(0,200,'ginger');
        player.scale.x = .2;
        player.scale.y = .2;
        player.animations.add('walk');

        player.animations.play('walk',5,true);

        }

    function update(){

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
        player.body.x -= speed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
        player.body.x += speed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
        player.body.y -= speed;
        player.body.x += speed/3;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
        player.body.y += speed;
        player.body.x -= speed/3;
        }
    }



};


