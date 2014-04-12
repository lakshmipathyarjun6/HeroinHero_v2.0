// GLOBAL VALUES
var STARTING_HIGHNESS = 250;
var MAX_HIGHNESS = 800;
var HIGHNESS_DECR_VAL = 0.1;

var PLAYER_KEY = 'ginger';
var PLAYER2_KEY = 'fob';
var DRAGON_KEY = 'dragon';
var HEROIN_KEY = 'heroin';
var ALCOHOL_KEY = 'alcohol';
var WEED_KEY = 'alcohol';
var LSD_KEY = 'alcohol';
var WATER_BUCKET_KEY = 'water_bucket';
var FLOOR_KEY = 'floor';
var SCROLL_SPEED = 2;
var CANVAS_Y_MAX = 50;
var CANVAS_Y_MIN = 0;
var CANVAS_X_MAX = 920;
var CANVAS_X_MIN = 0;
var BOUND_BOTTOM = 0;
var BOUND_TOP = 0;
var BOUND_LEFT = 0;
var BOUND_RIGHT = 0;
var DRAGON_LEFT = 0;
var DRAGON_DOWN = 0;
var PAUSE_BUTTON = 'pause';
var MUTE_BUTTON = 'mute';
var MUTE_STATE = 0;
var paused = false;
var muted = false;
var DRAGON_FLY_RATE = 10;
var PLAYER_WALK_RATE = 10;


// DEBUG
// override key values

window.onload = main()
ALCOHOL_KEY = PLAYER2_KEY;
WEED_KEY = PLAYER2_KEY;
LSD_KEY = PLAYER2_KEY;







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

    // Enable game physics
    game.physics.enable(this, Phaser.Physics.ARCADE);
};

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.constructor = Actor;


///////////////////////////////////
// Player class
///////////////////////////////////

Player = function(game, x, y, key)
{
    Actor.call(this, game, x, y, key);
    this.highness = STARTING_HIGHNESS;
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



///////////////////////////////////
// LSD class
///////////////////////////////////

LSDPickup = function (game, x, y)
{
    Pickup.call(this, game, x, y, LSD_KEY, 40);
}

LSDPickup.prototype = Object.create(Pickup.prototype);
LSDPickup.prototype.constructor = LSDPickup;

///////////////////////////////////
// Weed class
///////////////////////////////////

WeedPickup = function (game, x, y)
{
    Pickup.call(this, game, x, y, WEED_KEY, 10);
}

WeedPickup.prototype = Object.create(Pickup.prototype);
WeedPickup.prototype.constructor = WeedPickup;

///////////////////////////////////
// Alcohol class
///////////////////////////////////

AlcoholPickup = function (game, x, y)
{
    Pickup.call(this, game, x, y, ALCOHOL_KEY, 20);
}

AlcoholPickup.prototype = Object.create(Pickup.prototype);
AlcoholPickup.prototype.constructor = AlcoholPickup;

///////////////////////////////////
// Heroin class
///////////////////////////////////

HeroinPickup = function (game, x, y)
{
    Pickup.call(this, game, x, y, HEROIN_KEY, 50);
}

HeroinPickup.prototype = Object.create(Pickup.prototype);
HeroinPickup.prototype.constructor = HeroinPickup;


///////////////////////////////////
// Water Bucket class
///////////////////////////////////

WaterBucketPickup = function (game, x, y)
{
    Pickup.call(this, game, x, y, WATER_BUCKET_KEY, -30);
}

WaterBucketPickup.prototype = Object.create(Pickup.prototype);
WaterBucketPickup.prototype.constructor = WaterBucketPickup;


///////////////////////////////////
// Main function
///////////////////////////////////


function main() {


    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,update: update, render: render });

    var dragon_speed = 4;
    var player_speed = 4;
    var audioelement = document.createElement('audio');
    BOUND_BOTTOM = game.height-100;
    BOUND_TOP = 200;
    BOUND_RIGHT = game.width-100;
    BOUND_LEFT = 300;



    // List of Actors
    m_actorsList = new Array();


    function preload(){
        Phaser.Canvas.setSmoothingEnabled(game.context,false);
        game.stage.backgroundColor = '#ffffff';
        game.load.spritesheet(PAUSE_BUTTON, 'assets/sprites/pausespritesheet.png',64,64);
        game.load.spritesheet(MUTE_BUTTON, 'assets/sprites/soundbuttonspritesheet.png',64,64);
        game.load.image(FLOOR_KEY, 'assets/images/floor/floor.jpeg');
        game.load.image(HEROIN_KEY, 'assets/images/heroin/heroinsyringe.png');
        game.load.image(WATER_BUCKET_KEY, 'assets/images/other/Water_Bucket.png');
        game.load.image(PLAYER2_KEY, 'assets/images/playerV2/PlayerV2.png');
        game.load.atlasJSONHash(PLAYER_KEY,'assets/sprites/playerspriteatlas.png','assets/sprites/playersprite.json');
        game.load.atlasJSONHash(DRAGON_KEY,'assets/sprites/dragonspriteatlas.png','assets/sprites/dragonsprite.json');
    //  audioelement.setAttribute('src','assets/audio/Game_Music.mp3');

        // add text for score display
        game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');
    }

    var bmpText;

    function create () {
        //setup floor
        floor = game.add.tileSprite(0,game.height/2, game.width,game.height/2,'floor');

        //create pause button
        pause = game.add.button(30,30,PAUSE_BUTTON,pauseOnClick,this,1,0,1);
        pausekey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        pausekey.onDown.add(pauseOnClick, this); 

        //create mute button
        mute = game.add.button(game.width-100,30,MUTE_BUTTON,muteOnClick,this,1,0,1);
        mutekey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        mutekey.onDown.add(muteOnClick, this); 

        dragon = game.add.sprite(10,300,DRAGON_KEY);
        dragon.scale.y = .3;
        dragon.scale.x = .3;
        dragon.animations.add('fly');
        dragon.animations.play('fly',DRAGON_FLY_RATE,true);


        // set up m_player1
        m_player1 = new Player (game, game.width-100,game.height/2, PLAYER_KEY);
        //m_player1.body.velocity.x=-100;
        m_player1.scale.x = .2;
        m_player1.scale.y = .2;
        m_player1.animations.add('walk');
        m_player1.animations.play('walk',PLAYER_WALK_RATE,true);

        //m_player2 = new Player (game, game.width-300,game.height/2+100, PLAYER2_KEY);

        // highness meter & score counter
        highnessMeter = new Phaser.Rectangle(0,0,m_player1.highness,10);
        scoreCounter = 0; // initial score
        bmpText = game.add.bitmapText(300, 100, 'desyrel','Your score: ',20);

    //  cropRect = {x : 0, y : 0 , width : 400, height : 10};
    //   game.add.tween(cropRect).to(310, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    //  audioelement.play();
    //  audioelement.loop = true;




    }

    m_actorsList = new Array(); // empty


    function update() {
        //m_actorsList.push(new HeroinPickup(game, 2,1) );
        if(!paused) {

            var numPickups = m_actorsList.length;

            // Move the floor
            floor.tilePosition.x += SCROLL_SPEED; //update floor tile pos

            // Check for collisions
            for (var k=0; k < numPickups; k++)
            {
                game.physics.arcade.overlap(m_player1,m_actorsList[k],collisionHandler); //bind collisionHandler to player
            }

            // Move each pickup
            for (var k=0; k < numPickups; k++)
            {
                m_actorsList[k].x += SCROLL_SPEED; // go right
                if (m_actorsList[k].x > CANVAS_X_MAX)
                {
                    // he ran off the screen
                    m_actorsList[k].isAlive = false;
                }
            }

            // Remove dead pickups
            for (var k=0; k < m_actorsList.length; k++)
            {
                if (! m_actorsList[k].isAlive)
                {
                    // He's dead, Jim
                    m_actorsList[k].exists = false; // clear from screen
                    m_actorsList.splice(k,1); // remove that one element
                }

            }


            // update highness
            m_player1.highness -= HIGHNESS_DECR_VAL;
            highnessMeter.width = m_player1.highness;
            //game.add.tween(highnessMeter).to({x: '+10'},2000.Phaser.Easing.Linear.None,true);

            // refresh scoreCounter display
            bmpText.setText('Your score: ' + scoreCounter);


            /////////////////////////////
            // Move the Dragon
            /////////////////////////////

            if (DRAGON_LEFT == 1)
            {
                if (dragon.x <= 10)
                    DRAGON_LEFT = 0;
                else
                    dragon.x -= dragon_speed/2;
            }
            else
            {
                if (dragon.x >= 80)
                    DRAGON_LEFT = 1;
                else
                    dragon.x += dragon_speed/2;
            }
            if (DRAGON_DOWN == 1)
            {
                if (dragon.y >= 350)
                    DRAGON_DOWN = 0;
                else
                    dragon.y += dragon_speed/2;
            }
            else
            {
                if (dragon.y <= 90)
                    DRAGON_DOWN = 1;
                else
                    dragon.y -= dragon_speed/2;
            }  


            /////////////////////////////
            // Get user input
            /////////////////////////////

            var rand = Math.floor( (Math.random() * 1000) + 1 );

            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && m_player1.x > BOUND_LEFT)
            {
                if (rand <= 50 && m_player1.highness >= 400)
                {
                    m_player1.x += player_speed;
                }
                else
                {
                    m_player1.x -= player_speed;
                }
            } 

            if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && m_player1.x < BOUND_RIGHT)
            {
                if (rand <= 50 && m_player1.highness >= 400)
                {
                    m_player1.x -= player_speed;
                }
                else
                { 
                    m_player1.x += player_speed;
                }
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && m_player1.y > BOUND_TOP)
            {
                if(m_player1.x > BOUND_LEFT)
                {
                    m_player1.x -= player_speed/3;
                }
                if(rand <= 50 && m_player1.highness >= 400)
                {
                    m_player1.y += player_speed;
                }
                else
                { 
                    m_player1.y -= player_speed;
                }
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && m_player1.y < BOUND_BOTTOM)
            {
                if(m_player1.x < BOUND_RIGHT)
                {
                    m_player1.x += player_speed/3;
                }
                if(rand <= 50 && m_player1.highness >= 400)
                {
                    m_player1.y -= player_speed;
                }
                else
                { 
                    m_player1.y += player_speed;
                }
            }

            if (player_speed > 0)
            {
                player_speed -= 0.0002;
            }


            /////////////////////////////
            // Randomly create a pickup
            /////////////////////////////

            var randInt = Math.floor( (Math.random()*10000)); // between 

            // Let's make some drugs
            if (randInt < 20)
            {
                // Heroin!!!
                m_actorsList.push(new HeroinPickup(game, dragon.x+100, dragon.y+100) );
            }
            else if (randInt >= 20 && randInt < 40)
            {
                // Alcohol
                m_actorsList.push(new AlcoholPickup(game, dragon.x+100, dragon.y+100) );
            }
            else if (randInt >= 40 && randInt < 50)
            {
                // Jimi Hendrix
                m_actorsList.push(new LSDPickup(game, dragon.x+100, dragon.y+100));
            }
            else if (randInt >= 50 && randInt < 70)
            {
                // Weed
                m_actorsList.push(new WeedPickup(game, dragon.x+100, dragon.y+100) );
            }
            else if (randInt >= 70 && randInt < 80)
            {
                // Bad pickup
                m_actorsList.push(new WaterBucketPickup(game, dragon.x+100, dragon.y+100));
            }

        } // I hope this curly brace goes here

    }

    function collisionHandler(p, pkup) {
        pkup.isAlive = false; // kill him
        m_player1.highness += pkup.strength;
        scoreCounter += pkup.strength;
        if (m_player1.highness > MAX_HIGHNESS)
        {
            m_player1.highness = MAX_HIGHNESS;
        }
    }

    function render() {
        game.debug.geom(highnessMeter,'#ff0000');
        //game.debug.body(m_player1);
        //game.debug.body(heroin_syringe);
        //bucket = new WaterBucketPickup(game,100,100);
        //game.debug.body();
    }

    function pauseOnClick() {
        if(!paused){
            pause.setFrames(0,1,0);
            console.log("Nailed it");
            k = new Phaser.Rectangle(300,300,300,300);
            paused = true;
            SCROLL_SPEED  = 0;
            m_player1.animations.stop("walk",true);
            dragon.animations.stop("fly",true);
        } else {
            pause.setFrames(1,0,1);
            paused = false;
            SCROLL_SPEED  = 2;
            m_player1.animations.play("walk",PLAYER_WALK_RATE,true);
            dragon.animations.play("fly",DRAGON_FLY_RATE,true);
        }
        
    }
    function muteOnClick() {
        if(!muted){
            mute.setFrames(0,1,0);
            console.log("Mute");
            muted = true;
        } else {
            console.log("Unmute");
            mute.setFrames(1,0,1);
            muted = false;
        }
    }

};


