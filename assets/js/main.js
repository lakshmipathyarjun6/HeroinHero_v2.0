// GLOBAL VALUES
var STARTING_HEALTH = 100;
var MAX_HEALTH = 800;
var PLAYER_KEY = 'ginger';
var PLAYER2_KEY = 'fob';
var DRAGON_KEY = 'dragon';
var HEROIN_KEY = 'heroin';
var CANVAS_Y_MAX = 50;
var CANVAS_Y_MIN = 0;
var CANVAS_X_MAX = 920;
var CANVAS_X_MIN = 0;


window.onload = main()

function main() {


    var game = new Phaser.Game(1024, 600, Phaser.CANVAS, '', { preload: preload, create: create,update: update, render: render});

    var speed = 4;
    var audioelement = document.createElement('audio');


    // List of Actors
    m_actorsList = new Array();


    function preload(){
        Phaser.Canvas.setSmoothingEnabled(game.context,false);
        game.stage.backgroundColor = '#ffffff';
        
        game.load.image("heroin_syringe", 'assets/images/heroin/heroinsyringe.png');
        game.load.image("dino", 'assets/images/other/dino.png');
        game.load.image("player2", 'assets/images/playerV2/PlayerV2.png');
        game.load.atlasJSONHash('ginger','assets/sprites/playerspriteatlas.png','assets/sprites/playersprite.json');

//  audioelement.setAttribute('src','assets/audio/Game_Music.mp3');
    }

    function create () {

        heroin_syringe = game.add.sprite(500,100,'heroin_syringe');
    game.physics.enable(heroin_syringe,Phaser.Physics.ARCADE);
    heroin_syringe.body.immovable = true;
        dino = game.add.sprite(500,300,'dino');
        dino.scale.y = .08;
        dino.scale.x = .08;
        player2 = game.add.sprite(100,300,'player2');
        player = game.add.sprite(700,100,'ginger');
    game.physics.enable(player,Phaser.Physics.ARCADE);
//  player.body.velocity.x=-100;
        player.scale.x = .2;
        player.scale.y = .2;
        player.animations.add('walk');
        player.animations.play('walk',10,true);
    high_level = new Phaser.Rectangle(0,0,400,10);
//  cropRect = {x : 0, y : 0 , width : 400, height : 10};
//   game.add.tween(cropRect).to(310, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);
//  audioelement.play();
//  audioelement.loop = true;
    }


    function update(){

        game.physics.arcade.overlap(player,heroin_syringe,collisionHandler);
        high_level.width -= 0.3;
        //game.add.tween(high_level).to({x: '+10'},2000.Phaser.Easing.Linear.None,true);

        /////////////////////////////
        // Get user input
        /////////////////////////////

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

        /////////////////////////////
        // Randomly create a pickup
        /////////////////////////////

        var randInt = Math.floor( (Math.random()*1000)+1 ); // between 1 & 10
        //console.log(randInt);

        if (randInt < 10)
        {
            // heroin
            console.log("I'm making heroin!");
            m_actorsList.push(game.add.sprite(100,100,'heroin_syringe') );
        }
        else if (randInt >= 10 && randInt < 20)
        {
            // Bad pickup
            console.log("Fuck you!");
            // change this to the bad pickup
            m_actorsList.push(game.add.sprite(100,300,'heroin_syringe') );
        }

            

    }

    function collisionHandler(obj1, obj2) {
        obj2.exists = false;
    high_level.width += 300;
    }

    function render() {
    game.debug.geom(high_level,'#ff0000');
    }

};


