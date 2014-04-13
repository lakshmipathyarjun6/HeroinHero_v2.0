createLeaderBoard = function()
{
//    IC.admin.leaderboards.get();
//    console.log("check");
    IC.cache.leaderboards.id(1).get('',function(data) 
        { var obj = eval(data); 
            console.log(obj)});
}
