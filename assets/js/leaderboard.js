//function transform2(input)
//{
//    input = input / 257;
//    input = input - 17;
//
//    return input;
//}


function checkCheating(s1, s2)
{
    // returns true if there is cheating, false otherwise
    if (s1 != s2)
        return true;

    if ((s1 % 10) != 0 )
        return true;

    if (s1 > 5500) // nobody is this addicted to the game
        return true;


    return false; // assume no cheating otherwise
}


var uploading = $(document).ready(sendScoreWrapper() );

function sendScoreWrapper()
{
    sendScore("", 0);
}

var score2;
function sendScore (mode, newScore)
{
    if (mode == "setScore")
    {
        score2 = newScore;
        return;
    }

    $('#info').css('display','none');
    //$('#username').css('display','none');
    //$('#submit').css('display','none');

    $("#submit").click(function() {
        //console.log("Clicked dangit");
        Clay.ready(function() {
            var leaderboard = new Clay.Leaderboard({id: 'CTDleaderboard'});

            var username = $("#name").val();
            var score = document.getElementById("score").innerHTML;
            //var score2 = document.getElementById("player_num").innerHTML;

            //score2 = transform2(score2);
            if (checkCheating(score, score2) )
            {
                // there was cheating
                console.log("Looks like you've been cheating...");
                console.log("Your score has been set to 0");

                score = 0;
            }
            //console.log(score);
            //console.log(score2);

            var options = {score: score,name:username};
            var showoptions = { // all of these are optional
                //html: "<strong>Hi</strong>", // Optional, any custom html you want to show below the name
                //recent: 3600, // Optional, to limit scores to ones posted in last x seconds
                //sort: 'asc', // Optional, sorting by "asc" will show the lowest scores first (ex. for fastest times)
                //filter: ['day', 'month'], // Optional, Array of filters to narrow down high scores
                //cumulative: false, // Optional, if set to true grabs the sum of all scores for each player
                //best: false, // Optional, if set to true grabs the best score from each player
                limit: 10, // Optional, how many scores to show (0 for all). Default is 10
                //self: true, // Optional, Boolean if set to true shows just the scores of the player viewing
                //friends: false, // Optional, Boolean if set to true shows just the scores of the player viewing AND their Clay.io friends
                showPersonal: true // Optional, Boolean on if the player's stats (rank & high score) should show below the name. Default is false
            };
            leaderboard.post(options,function(response) {
                $('#info').css('display','none');
                //$('#username').css('display','none');
                //$('#submit').css('display','none');
                leaderboard.show( showoptions,function(response) {
                    //console.log( response );
                });
            });
        });
    });
}

