// GLOBAL VALUES
var STARTING_HEALTH = 100;
var MAX_HEALTH = 800;
var PLAYER_KEY = 'ginger';
var PLAYER2_KEY = 'fob';
var DRAGON_KEY = 'dragon';
var HEROIN_KEY = 'heroin';




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
// Actor class -- virtual
///////////////////////////////////


function Actor(game, x, y, key)
{
    //this.x = x;
    //this.y = y;

    // Derive from sprite
    // this line is a bitch
    //Phaser.Sprite.call(this, game, x, y, key);


    this.isVisible = true; // default
    this.isAlive = true; // default

    // Add as a Sprite
    //game.add.existing(this);
};

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.constructor = Actor;

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

function Player(game, x, y)
{
    Actor.call(this, game, x, y, PLAYER_KEY);
    this.health = STARTING_HEALTH;
}

// correct the constructor pointer because it points to Person
Player.prototype.constructor = Player;

// perhaps walk method when I can implement it

///////////////////////////////////
// Pickup class -- virtual
///////////////////////////////////

function Pickup(game, x, y, key, strength)
{
    Actor.call(this, game, x, y, key, strength);
    this.strength = strength;
}

//Pickup.prototype.harmPlayer(p, amount)
//{
//    //p.health -= amount; // bug
//}

///////////////////////////////////
// Heroin class
///////////////////////////////////

function HeroinPickup(game, x, y, key)
{
    Pickup.call(this, game, x, y, HEROIN_KEY, 50);
}


///////////////////////////////////
// Main function
///////////////////////////////////


function main() {



    // declare game object as global // or not
    var game = new Phaser.Game(1024, 600, Phaser.CANVAS, '', { preload: preload, create: create,update: update });

    var speed = 4;
    var audioelement = document.createElement('audio');

    function preload(){
        Phaser.Canvas.setSmoothingEnabled(game.context,false);
        game.stage.backgroundColor = '#ffffff';
        
        game.load.image(HEROIN_KEY, 'assets/images/heroin/heroinsyringe.png');
        game.load.image(DRAGON_KEY, 'assets/images/other/dino.png');
        game.load.image(PLAYER2_KEY, 'assets/images/playerV2/PlayerV2.png');
        game.load.atlasJSONHash(PLAYER_KEY,'assets/sprites/playerspriteatlas.png','assets/sprites/playersprite.json');

	//audioelement.setAttribute('src','assets/audio/Game_Music.mp3');
    }

    function create () {

        spr1 = new Phaser.Sprite(game, 100, 500, HEROIN_KEY);
        //game.add.existing(spr1);

        heroin_syringe = game.add.sprite(500,100,HEROIN_KEY);
        dino = game.add.sprite(500,300,DRAGON_KEY);
        dino.scale.y = .08;
        dino.scale.x = .08;
        player2 = game.add.sprite(100,300,PLAYER2_KEY);
        m_player1 = game.add.sprite(0,200,PLAYER_KEY);
        m_player1.scale.x = .2;
        m_player1.scale.y = .2;
        m_player1.animations.add('walk');
        m_player1.animations.play('walk',10,true);
	//audioelement.play();
	audioelement.loop = true;
    }

    // DEBUG
    //a1 = new Actor(1,1);
    p1 = new Player(game, 5,1);
    h1 = new HeroinPickup(game, 2,1);


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


