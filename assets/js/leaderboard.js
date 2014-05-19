



var uploading = $(document).ready(function(){
    $('#info').css('display','none');
    //$('#username').css('display','none');
    //$('#submit').css('display','none');
    
    $("#submit").click(function() {
        console.log("Clicked dangt");
        Clay.ready(function() {
            var leaderboard = new Clay.Leaderboard({id: 'CTDleaderboard'});
            
            var username = $("#name").val();
            var score = document.getElementById("score").innerHTML;
            console.log(username);
            var options = {score: score,name:username};
            var showoptions = { // all of these are optional
                //html: "<strong>Hi</strong>", // Optional, any custom html you want to show below the name recent: 3600, // Optional, to limit scores to ones posted in last x seconds
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
                    console.log( response );
                });
            });
        });
    });
});

