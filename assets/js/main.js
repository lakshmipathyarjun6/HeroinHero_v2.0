// GLOBAL VALUES
var STARTING_HEALTH = 100;
var MAX_HEALTH = 800;
var PLAYER_KEY = 'ginger';
var PLAYER2_KEY = 'fob';
var DRAGON_KEY = 'dragon';
var HEROIN_KEY = 'heroin';
var FLOOR_KEY = 'floor';
var CANVAS_Y_MAX = 50;
var CANVAS_Y_MIN = 0;
var CANVAS_X_MAX = 920;
var CANVAS_X_MIN = 0;


window.onload = main()

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


Actor = function (game, x, y, key)
{
    // Derive from sprite
    Phaser.Sprite.call(this, game, x, y, key);


    this.isVisible = true; // default
    this.isAlive = true; // default

    // Add as a Sprite
    game.add.existing(this);
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

Player = function(game, x, y)
{
    Actor.call(this, game, x, y, PLAYER_KEY);
    this.health = STARTING_HEALTH;
}

// correct the constructor pointer because it points to Person
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

// perhaps walk method when I can implement it


///////////////////////////////////
// Dragon class
///////////////////////////////////

Dragon = function(game, x, y)
{
    Actor.call(this, game, x, y, DRAGON_KEY);
}

// correct the constructor pointer because it points to Person
Dragon.prototype = Object.create(Actor.prototype);
Dragon.prototype.constructor = Dragon;

// perhaps walk method when I can implement it


///////////////////////////////////
// Pickup class -- virtual
///////////////////////////////////

Pickup = function (game, x, y, key, strength)
{
    Actor.call(this, game, x, y, key, strength);
    this.strength = strength;
}

Pickup.prototype = Object.create(Actor.prototype);
Pickup.prototype.constructor = Pickup;
//Pickup.prototype.harmPlayer(p, amount)
//{
//    //p.health -= amount; // bug
//}

///////////////////////////////////
// Heroin class
///////////////////////////////////

HeroinPickup = function (game, x, y, key)
{
    Pickup.call(this, game, x, y, HEROIN_KEY, 50);
}

HeroinPickup.prototype = Object.create(Pickup.prototype);
HeroinPickup.prototype.constructor = HeroinPickup;

///////////////////////////////////
// Main function
///////////////////////////////////


function main() {


    // declare game object as global // or not
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,update: update, render: render });

    var speed = 4;
    var audioelement = document.createElement('audio');


    // List of Actors
    m_actorsList = new Array();


    function preload(){
        Phaser.Canvas.setSmoothingEnabled(game.context,false);
        game.stage.backgroundColor = '#ffffff';
        game.load.image(FLOOR_KEY, 'assets/images/floor/floor.jpeg');
        game.load.image(HEROIN_KEY, 'assets/images/heroin/heroinsyringe.png');
        game.load.image(PLAYER2_KEY, 'assets/images/playerV2/PlayerV2.png');
        game.load.atlasJSONHash(PLAYER_KEY,'assets/sprites/playerspriteatlas.png','assets/sprites/playersprite.json');
	game.load.atlasJSONHash(DRAGON_KEY,'assets/sprites/dragonspriteatlas.png','assets/sprites/dragonsprite.json');
    //  audioelement.setAttribute('src','assets/audio/Game_Music.mp3');
    }

    function create () {
        //setup floor
        floor = game.add.tileSprite(0,game.height/2, game.width,game.height/2,'floor');

        heroin_syringe = game.add.sprite(500,100,HEROIN_KEY);
        game.physics.enable(heroin_syringe,Phaser.Physics.ARCADE);
        heroin_syringe.body.immovable = true;
	dragon = game.add.sprite(500,300,DRAGON_KEY);
        dragon.scale.y = .3;
        dragon.scale.x = .3;
	dragon.animations.add('fly');
	dragon.animations.play('fly',10,true);
        player2 = game.add.sprite(100,300,PLAYER2_KEY);
        m_player1 = game.add.sprite(game.width-100,game.height/2,PLAYER_KEY);
        game.physics.enable(m_player1,Phaser.Physics.ARCADE);
        //m_player1.body.velocity.x=-100;
        m_player1.scale.x = .2;
        m_player1.scale.y = .2;
        m_player1.animations.add('walk');
        m_player1.animations.play('walk',10,true);
        high_level = new Phaser.Rectangle(0,0,400,10);
    //  cropRect = {x : 0, y : 0 , width : 400, height : 10};
    //   game.add.tween(cropRect).to(310, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    //  audioelement.play();
    //  audioelement.loop = true;
    }

    m_actorsList = new Array(); // empty


    function update() {
        m_actorsList.push(new HeroinPickup(game, 2,1) );
        //console.log(m_actorsList.length );

        floor.tilePosition.x += 2; //update floor tile pos

        game.physics.arcade.overlap(m_player1,heroin_syringe,collisionHandler); //bind collisionHandler to player
        high_level.width -= 0.3;
        //game.add.tween(high_level).to({x: '+10'},2000.Phaser.Easing.Linear.None,true);

        /////////////////////////////
        // Get user input
        /////////////////////////////

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            m_player1.x -= speed;
	    dragon.x -= speed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            m_player1.x += speed;
	    dragon.x += speed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            m_player1.y -= speed;
	    dragon.y -= speed;
            m_player1.x -= speed/3;
	    dragon.x -= speed/3;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            m_player1.y += speed;
	    dragon.y += speed;
            m_player1.x += speed/3;
	    dragon.x += speed/3;
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
            m_actorsList.push(game.add.sprite(100,100,HEROIN_KEY) );
        }
        else if (randInt >= 10 && randInt < 20)
        {
            // Bad pickup
            console.log("Fuck you!");
            // change this to the bad pickup
            m_actorsList.push(game.add.sprite(100,300,HEROIN_KEY) );
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


