/**************************************************************************
 *
 * HeroinHero version 2.0
 *
 * Authors: Joraaver Chahal, Arjun Lakshmipathy, Nate Fischer
 * Built at LA Hacks April 2014
 *
 * Based on the "Guitar Queer-o" episode from Southpark
 *
 * Music credit goes to Pogo. If you like the music, check out more of his
 * stuff here:
 * http://www.youtube.com/user/Fagottron
 *
 * This is an open source game. Feel free to distribute the source code.
 * Feel free to play our game and distribute links to our game. If you want
 * to be part of the development of this game, make a pull request on our
 * Github Repo. Enjoy!
 *
 *************************************************************************/

// GLOBAL VALUES

var NEXT_ARROW = 'next';
var START_MENU_1 = 'smenu1';
var START_MENU_2 = 'smenu2';
var MENU_KEY = 'menu';
var PLAYER_KEY = 'ginger';
var SFX_KEY = 'sfx';
var PLAYER2_KEY = 'asian';
var DRAGON_KEY = 'dragon';
var HEROIN_KEY = 'heroin';
var ALCOHOL_KEY = 'alcohol';
var WEED_KEY = 'weed';
var WATER_BUCKET_KEY = 'water_bucket';
var FLOOR_KEY = 'floor';
var DEATH_KEY = 'death';
var RECOVERY_KEY = 'recovery';
var RED_KEY = 'red screen';
var AUDIO_KEY = 'audio';

var STARTING_HIGHNESS = 250;
var MAX_HIGHNESS = 800;
var HIGHNESS_DECR_VAL = 0.15;
var sfxCount = 300;
var SFX_WAIT_TIME = 300;
var MSG_HEIGHT = 100;
var SCROLL_SPEED = 2;
var CANVAS_Y_MAX = 50;
var CANVAS_Y_MIN = 0;
var CANVAS_X_MAX = 920;
var CANVAS_X_MIN = 0;
var BOUND_TOP = 250;
var BOUND_LEFT = 500; // starting value
var BOUND_RIGHT; // initialized later
var BOUND_BOTTOM; // initialized later
var DRAGON_LEFT = 0;
var DRAGON_DOWN = 0;
var PAUSE_BUTTON = 'pause';
var MUTE_BUTTON = 'mute';
var RETRY_BUTTON = 'retry';
var QUIT_BUTTON = 'quit';
var MUTE_STATE = 0;
var paused = false;
var muted = false;
var wasMuted = false;
var DRAGON_FLY_RATE = 10;
var PLAYER_WALK_RATE = 10;
var in_menu = true;

var calledEnd = false;
var gameHasStarted = false;


window.onload = main()




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
   Pickup.call(this, game, x, y, WATER_BUCKET_KEY, -40);
}

WaterBucketPickup.prototype = Object.create(Pickup.prototype);
WaterBucketPickup.prototype.constructor = WaterBucketPickup;

///////////////////////////////////
// Roommate class
///////////////////////////////////

Roommate = function (game, x, y)
{
   Pickup.call(this, game, x, y, PLAYER2_KEY, -70);
}

Roommate.prototype = Object.create(Pickup.prototype);
Roommate.prototype.constructor = Roommate;

/*

                       .     _///_,
                     .      / ` ' '>
                       )   o'  __/_'>
                      (   /  _/  )_\'>
                       ' "__/   /_/\_>
                           ____/_/_/_/
                          /,---, _/ /
                         ""  /_/_/_/
                            /_(_(_(_                 \
                           (   \_\_\\_               )\
                            \'__\_\_\_\__            ).\
                            //____|___\__)           )_/
                            |  _  \'___'_(           /'
                             \_ (-'\'___'_\      __,'_'
                             __) \  \\___(_   __/.__,'
                   b'ger  ,((,-,__\  '", __\_/. __,'
                                       '"./_._._-'

You caught the dragon!
from: http://www.chris.com/ascii/index.php?art=creatures%2Fdragons

*/

///////////////////////////////////
// Main function
///////////////////////////////////


function main()
{
    msgCounter = 0;
    msgWait = 3000;

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,update: update, render: render });

    var dragon_speed = 4;
    var player_speed = 4;
    var audioelement = document.createElement('audio');
    var sfxelement = document.createElement('audio');
    BOUND_BOTTOM = game.height-100;
    BOUND_RIGHT = game.width-100;



    // List of Actors
    m_actorsList = new Array();


    function preload()
    {
        $.getScript('assets/js/leaderboard.js', function() {});

        Phaser.Canvas.setSmoothingEnabled(game.context,false);
        game.stage.backgroundColor = '#ffffff';

        // load images and spritesheets
        game.load.image(START_MENU_1, 'assets/images/menu/startMenu1.png');
        game.load.image(START_MENU_2, 'assets/images/menu/startMenu2.png');
        game.load.image(MENU_KEY, 'assets/images/menu/menu.png');
        game.load.spritesheet(PAUSE_BUTTON, 'assets/sprites/pausespritesheet.png',64,64);
        game.load.spritesheet(NEXT_ARROW, 'assets/images/menu/next.png',156,102);
        game.load.spritesheet(MUTE_BUTTON, 'assets/sprites/soundbuttonspritesheet.png',64,64);
        game.load.image(FLOOR_KEY, 'assets/images/floor/background4.png');
        game.load.image(DEATH_KEY, 'assets/images/other/BlueScreen.png');
        game.load.image(RECOVERY_KEY, 'assets/images/other/BlueScreen2.png');
        game.load.image(RED_KEY, 'assets/images/other/red.png');
        game.load.image(HEROIN_KEY, 'assets/images/drugs/heroin/heroinsyringe.png');
        game.load.image(WATER_BUCKET_KEY, 'assets/images/other/Water_Bucket.png');
        game.load.audio(AUDIO_KEY, 'assets/audio/Game_Music.mp3');
        game.load.audio(SFX_KEY, 'assets/audio/Catch_Me.mp3');
        game.load.image(PLAYER2_KEY, 'assets/images/playerV2/PlayerV2.png');
        game.load.image(WEED_KEY, 'assets/images/drugs/marijuana/weed.png');
        game.load.image(ALCOHOL_KEY, 'assets/images/drugs/beer/Beer.png');

        game.load.atlasJSONHash(PLAYER_KEY,'assets/sprites/playerspriteatlas.png','assets/sprites/playersprite.json');
        game.load.atlasJSONHash(DRAGON_KEY,'assets/sprites/dragonspriteatlas.png','assets/sprites/dragonsprite.json');
        game.load.atlasJSONHash(RETRY_BUTTON,'assets/sprites/retrybuttonspriteatlas.png','assets/sprites/retrybutton.json');
        game.load.atlasJSONHash(QUIT_BUTTON,'assets/sprites/quitbuttonspriteatlas.png','assets/sprites/quitbutton.json');


        // audioelement.setAttribute('src','assets/audio/Game_Music.mp3');

        // add text for score display
        game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');
    }

    var musicCreds;
    var bmpText;
    var msgText;
    var scoreCounter;
    var highnessMeter;
    var m_player1;
    var m_actorsList;
    var timer;

    function create ()
    {
        // play music
        sfx = game.add.audio(SFX_KEY);
        music = game.add.audio(AUDIO_KEY);
        sfx.loop = false;
        music.loop = true;
        music.play();

        //setup floor
        floor = game.add.tileSprite(0,game.height/4, game.width,600,'floor');

        //create pause button
        pause = game.add.button(30,30,PAUSE_BUTTON,pauseOnClick,this,1,0,1);
        pausekey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        pausekey.onDown.add(pauseOnClick, this);

        //create mute button
        mute = game.add.button(game.width-100,30,MUTE_BUTTON,muteOnClick,this,1,0,1);
        mutekey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        mutekey.onDown.add(muteOnClick, this);

        // credit Pogo for the music
        musicCreds = game.add.bitmapText(game.width-250, 90, 'desyrel','Music: "Boo Bass" by Pogo',18);
        musicCreds.inputEnabled = true;
        musicCreds.events.onInputDown.add(goToPogo, this);

        

        dragon = new Dragon(game, 10, 300);
        //dragon = game.add.sprite(10,300,DRAGON_KEY);
        dragon.scale.y = .3;
        dragon.scale.x = .3;
        dragon.animations.add('fly');
        dragon.animations.play('fly',DRAGON_FLY_RATE,true);


        // set up m_player1
        m_player1 = new Player (game, game.width-100,game.height/2, PLAYER_KEY);
        //m_player1.body.velocity.x=-100;
        //m_player1.scale.x = .2;
        //m_player1.scale.y = .2;
        m_player1.animations.add('walk');
        m_player1.animations.play('walk',PLAYER_WALK_RATE,true);

        //m_player2 = new Player (game, game.width-300,game.height/2+100, PLAYER2_KEY);

        // highness meter & score counter
        highnessMeter = new Phaser.Rectangle(0,0,m_player1.highness,10);
        scoreCounter = 0; // initial score
        bmpText = game.add.bitmapText(game.width/2-100, 50, 'desyrel','Your score: ',30);


        smenu2 = game.add.sprite(0,0,START_MENU_2);
        smenu1 = game.add.sprite(0,0,START_MENU_1);
        next = game.add.button(game.width-200,game.height-100,NEXT_ARROW,nextOnClick,this,0,0,0);

        //  Create our Timer
        timer = game.time.create(false);

        //  Set a TimerEvent to occur after 3 seconds
        paused = true;
        timer.add(10000, fadePictures, this);

        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        timer.start();

        game.time.events.repeat(Phaser.Timer.SECOND * 1, 100000, randomizeBG, this);

    }

    var m_actorsList = new Array(); // empty


    function update()
    {
        if(muted)
            music.pause();
        else
            music.resume();

        if(!paused)
        {


            if (!m_player1.isAlive && !calledEnd)
            {
                endOfGame();
            }

            // adjust player's box
            if (scoreCounter >= 0 && scoreCounter < 1000)
                BOUND_LEFT = 400 + ((1000-scoreCounter) / 10);

            else if (scoreCounter >= 1000 && scoreCounter < 2000)
                BOUND_LEFT = 340 + ((2000-scoreCounter) / 16);

            else if (scoreCounter >= 2000 && scoreCounter < 3000)
                BOUND_LEFT = 300 + ((3000-scoreCounter) / 25);

            else
                BOUND_LEFT = 300;


            var numPickups = m_actorsList.length;

            // Move the floor
            floor.tilePosition.x += SCROLL_SPEED; //update floor tile pos

            // Check for collisions
            for (var k=0; k < numPickups; k++)
            {
                game.physics.arcade.overlap(m_player1,m_actorsList[k],collisionHandler); //bind collisionHandler to player
            }
            game.physics.arcade.overlap(m_player1,dragon,winGame); //bind collisionHandler to player

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
                    m_actorsList[k].destroy();
                    delete m_actorsList[k]; // free memory
                    m_actorsList.splice(k,1); // remove that one element


                }

            }

            // update highness
            m_player1.highness -= HIGHNESS_DECR_VAL;
            if (m_player1.highness <= 0)
                m_player1.isAlive = false;

            // check player's death again, just in case
            if (!m_player1.isAlive && !calledEnd)
            {
                // Oh no!
                endOfGame();
            }

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
                if (dragon.y >= 400)
                    DRAGON_DOWN = 0;
                else
                    dragon.y += dragon_speed/2;
            }
            else
            {
                if (dragon.y <= 130)
                    DRAGON_DOWN = 1;
                else
                    dragon.y -= dragon_speed/2;
            }

            if(scoreCounter >= sfxCount){
                sfxCount += SFX_WAIT_TIME;
                if (!muted)
                {
                    sfx.play();
                }
            }


            /////////////////////////////
            // Get user input
            /////////////////////////////

            var rand = Math.floor( (Math.random() * 1000) + 1 );

            if ((game.input.keyboard.isDown(Phaser.Keyboard.LEFT)||game.input.keyboard.isDown(Phaser.Keyboard.A)) && m_player1.x > BOUND_LEFT)
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

            if ((game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D))&& m_player1.x < BOUND_RIGHT)
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

            if ((game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W)) && m_player1.y > BOUND_TOP)
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
            if ((game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S)) && m_player1.y < BOUND_BOTTOM)
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
                player_speed -= 0.00001;
            }


            /////////////////////////////
            // Randomly create a pickup
            /////////////////////////////


            if (!calledEnd)
            {
                var randInt = Math.floor( (Math.random()*3000));

                if (randInt < ((scoreCounter/50) - 10) ) // will overlap Weed over time
                {
                    // Water bucket = bad
                    // increase # over time
                    m_actorsList.push(new WaterBucketPickup(game, dragon.x+100, dragon.y+100));
                }

                // Let's make some drugs
                else if (randInt < 50) // overlapped by WaterBuckets over time
                {
                    // Weed
                    m_actorsList.push(new WeedPickup(game, dragon.x+100, dragon.y+100) );
                }
                else if (randInt >= 50 && randInt < 70)
                {
                    // Alcohol
                    m_actorsList.push(new AlcoholPickup(game, dragon.x+100, dragon.y+100) );
                }
                else if (randInt >= 70 && randInt < 80)
                {
                    // Heroin!!!
                    m_actorsList.push(new HeroinPickup(game, dragon.x+100, dragon.y+100) );
                }
                else if (randInt >= 80 && randInt < (70 + scoreCounter / 160) )
                {
                    // can't make evil roommates in the beginning of the game.
                    // increase # of evil roommates over time
                    m_actorsList.push(new Roommate(game, dragon.x+100, dragon.y+100) );
                }



                if(player_speed > 1)
                {
                    player_speed -= 0.0002;
                }
            }

            /////////////////////////////
            // Write a message
            /////////////////////////////

            // decrement counter if necessary
            if (msgCounter > 1) // show the message a little longer
                msgCounter--;
            else if (msgCounter == 1) // time to delete the message
            {
                // clear the message
                msgText.destroy();
                msgCounter--;
                msgWait = 3000;
            }
            else if (msgWait == 0)// time for a new message
            {
                var displayVal = Math.floor( Math.random() * 10 );
                switch(displayVal)
                {
                  case 0:
                  case 1:
                    msgText = game.add.bitmapText(game.width/2-200, MSG_HEIGHT, 'desyrel',"Don't let your highness meter take a hit!",20);
                    msgCounter = 500;
                    break;
                  case 2:
                    msgText = game.add.bitmapText(game.width/2-45, MSG_HEIGHT, 'desyrel',"Hey, man!",20);
                    msgCounter = 500;
                    break;
                  case 3:
                    msgText = game.add.bitmapText(game.width/2-100, MSG_HEIGHT, 'desyrel',"Respect my authority!",20);
                    msgCounter = 500;
                    break;
                  case 4:
                  case 5:
                    msgText = game.add.bitmapText(game.width/2-90, MSG_HEIGHT, 'desyrel','"Catch me! Come on!"',20);
                    msgCounter = 500;
                    break;
                  case 6:
                  case 7:
                    msgText = game.add.bitmapText(game.width/2-100, MSG_HEIGHT, 'desyrel',"Ease the stress a bit...",20);
                    msgCounter = 500;
                    break;

                  default:
                    // nothing
                }
            }
            else
            {
                // not showing a message, but must still wait to show one
                msgWait--;
            }
        }
    }

    function winGame() {
        console.log("Congratulations! You won the game! You're a real hacker.");
        scoreCounter += 999999999999999999;
        dragon.x = 10;
    }
    function collisionHandler(p, pkup) {
        pkup.isAlive = false; // kill the pickup
        m_player1.highness += pkup.strength;
        if (pkup.strength > 0)
        {
            scoreCounter += pkup.strength;
        }
        else
        {
            // tint the screen red to show you're hurt
            var redScreen = game.add.sprite(0,0,RED_KEY);
            game.add.tween(redScreen).to( { alpha: 0 }, 600, Phaser.Easing.Linear.None, true);

        }
        if (m_player1.highness > MAX_HIGHNESS)
        {
            m_player1.highness = MAX_HIGHNESS;
        }
    }

    function render() {
        if(!in_menu){
            game.debug.geom(highnessMeter,'#ff0000');
        }
        //game.debug.body(m_player1);
        //for (var k=0; k < m_actorsList.length; k++)
        //    game.debug.body(m_actorsList[k]);

    }

    function goToPogo()
    {
        window.open("https://www.youtube.com/watch?v=0W1ULoLs6Cg");
        // the game's tab will automatically mute when we switch to the pogo tab
    }

    function pauseOnClick() {
        if(!paused) {
            pause.setFrames(0,1,0);
            menu = game.add.sprite(0,0,MENU_KEY);
            k = new Phaser.Rectangle(300,300,300,300);
            paused = true;
            SCROLL_SPEED  = 0;
            m_player1.animations.stop("walk",true);
            dragon.animations.stop("fly",true);
            wasMuted = muted;
            muted = true;
        } else {
            menu.destroy();
            pause.setFrames(1,0,1);
            paused = false;
            SCROLL_SPEED  = 2;
            m_player1.animations.play("walk",PLAYER_WALK_RATE,true);
            dragon.animations.play("fly",DRAGON_FLY_RATE,true);
            muted = wasMuted;
        }

    }

    function muteOnClick() {
        if (paused)
        {
            // do nothing
            return;
        }
        if(!muted){
            mute.setFrames(0,1,0);
            muted = true;
            music.pause();
            sfx.pause();
        } else {
            mute.setFrames(1,0,1);
            muted = false;
            music.resume();
            sfx.resume();
        }
    }

    function randomizeBG() {
        if (!paused)
        {
            game.stage.backgroundColor = getRandomColor();
        }
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }

    function fadePictures() {

        //  Cross-fade the two pictures
        var tween;

        if (smenu1.alpha == 1)
        {
            tween = game.add.tween(smenu1).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            game.add.tween(smenu2).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        }

        //  When the cross-fade is complete we swap the image being shown by the now hidden picture
        //tween.onComplete.add(changePicture, this);
        game.time.events.add(Phaser.Timer.SECOND * 8,startGame, this);

    }

    function startGame() {
        if (!gameHasStarted)
        {
            next.destroy();
            smenu1.destroy();
            in_menu = false;
            game.add.tween(smenu2).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            paused = false;
            smenu2.destroy();
            gameHasStarted = true;
        }
    }


    var death;
    var retry_button;
    var quit_button;

    function endOfGame()
    {
        getUser();
        calledEnd = true;
        SCROLL_SPEED = 0;
        paused = true;

        // kill animations
        m_player1.animations.stop("walk",true);
        dragon.animations.stop("fly",true);

        music.stop();
        death = game.add.sprite(0,0,DEATH_KEY);
        death.anchor.setTo(0, 0);
        death.alpha = 0;
        game.add.tween(death).to( { alpha: 1 }, 4000, Phaser.Easing.Linear.None, true, 0, 0, false);
        retry_button = game.add.button(game.world.centerX - 160, 400, RETRY_BUTTON, actionRetry, this, 0, 0, 0);
        quit_button = game.add.button(game.world.centerX + 40, 400, QUIT_BUTTON, actionQuit, this, 0, 0, 0);
    }

    function actionRetry()
    {
        for (var k=0; k < m_actorsList.length; k++)
        {
            m_actorsList[k].isAlive = false;
        }
        player_speed = 4;
        dragon.x = 10;
        dragon.y = 300;
        SCROLL_SPEED = 2;

        // restore animations
        m_player1.animations.play("walk",PLAYER_WALK_RATE,true);
        dragon.animations.play("fly",DRAGON_FLY_RATE,true);

        m_player1.x = game.width-100;
        m_player1.y = game.height/2;
        m_player1.highness = STARTING_HIGHNESS;
        m_player1.isAlive = true;
        scoreCounter = 0;
        music.play();
        if (muted)
        {
            // we don't really want the music to be heard in this case
            music.pause()
            // we update the mute button to start with the correct image
            mute.setFrames(0,1,0);
        }
        death.destroy();
        delete death;

        retry_button.destroy();
        delete retry_button;

        quit_button.destroy();
        delete quit_button;

        paused = false;
        calledEnd = false;
    }

    function actionQuit()
    {
        for (var k=0; k < m_actorsList.length; k++)
        {
            m_actorsList[k].isAlive = false;
        }
        death.destroy();
        delete death;

        retry_button.destroy();
        delete retry_button;

        quit_button.destroy();
        delete quit_button;

        recovery = game.add.sprite(0,0,RECOVERY_KEY);
    }
    function nextOnClick()
    {
        if (smenu1.alpha == 1){
            fadePictures();
        } else {
            next.destroy();
            startGame();
        }
    }
    function getUser(){
        $('#info').css('display','show');
        document.getElementById('score').innerHTML=scoreCounter;
        //$('#username').css('display','show');
        //$('#submit').css('display','show');
        $('#info').css('left',$(document).width()/2 - $('#info').width()/2+'px');
        $('#submit').css('left',$(document).width()/2 - $('#submit').width()/2+'px');

    };
};


