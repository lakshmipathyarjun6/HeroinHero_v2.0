// GLOBAL VALUES
var STARTING_HEALTH = 100;



window.onload = main();

//function include(filename)
//{
//    var head = document.getElementsByTagName('head')[0];
//
//    var script = document.createElement('script');
//    script.src = filename;
//    script.type = 'text/javascript';
//
//    head.appendChild(script)
//}
//
//include("assets/js/actor.js");

///////////////////////////////////
// Actor class
///////////////////////////////////


function Actor(x, y)
{
    this.x = x;
    this.y = y;
    this.isVisible = true; // default
    this.isAlive = true; // default
}

// Member functions
//Actor.prototype.setAlive = function(val)
//{
//    this.isAlive = val; // this is it!
//}
//
//Actor.prototype.setVisible = function(val)
//{
//    this.isVisible = val; // this is it!
//}
//
//Actor.prototype.moveHoriz = function(amount) // Postive means right
//{
//    this.x += amount;
//}
//
//Actor.prototype.moveVert = function(amount) // Postive means right
//{
//    this.y += amount;
//}

///////////////////////////////////
// Player class
///////////////////////////////////

function Player(x, y)
{
    Actor.call(this, x, y);
    this.health = STARTING_HEALTH;
}

// correct the constructor pointer because it points to Person
Player.prototype.constructor = Player;















function main() {

    var game = new Phaser.Game(1024, 600, Phaser.CANVAS, '', { preload: preload, create: create,update: update });

    var speed = 4;
    var audioelement = document.createElement('audio');

    function preload(){
        Phaser.Canvas.setSmoothingEnabled(game.context,false);
        game.stage.backgroundColor = '#ffffff';
        
        game.load.image("heroin_syringe", 'assets/images/heroin/heroinsyringe.png');
        game.load.image("dino", 'assets/images/other/dino.png');
        game.load.image("player2", 'assets/images/playerV2/PlayerV2.png');
        game.load.atlasJSONHash('ginger','assets/sprites/playerspriteatlas.png','assets/sprites/playersprite.json');

	//audioelement.setAttribute('src','assets/audio/Game_Music.mp3');
    }

    function create () {

        heroin_syringe = game.add.sprite(500,100,'heroin_syringe');
        dino = game.add.sprite(500,300,'dino');
        dino.scale.y = .08;
        dino.scale.x = .08;
        player2 = game.add.sprite(100,300,'player2');
        m_player1 = game.add.sprite(0,200,'ginger');
        m_player1.scale.x = .2;
        m_player1.scale.y = .2;
        m_player1.animations.add('walk');
        m_player1.animations.play('walk',10,true);
	//audioelement.play();
	audioelement.loop = true;
    }

    // DEBUG
    a1 = new Actor(1,1);
    p1 = new Player(5,1);


    function update(){

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            m_player1.x -= speed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            m_player1.x += speed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            m_player1.y -= speed;
            m_player1.x -= speed/3;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            m_player1.y += speed;
            m_player1.x += speed/3;
        }
    }



};


