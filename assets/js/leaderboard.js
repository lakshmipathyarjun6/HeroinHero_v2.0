


$(document).ready(function(){
    alert('go');
    $("#submit").click(function() {
        alert($("#username").val());
        $.ajax({
            type: 'POST',
            url: 'https://api.isaacloud.com/v1/admin/leaderboards',
            data: {
                "active": true,
                "cron": "0 0 1 * * *",
                "description": "Main user leaderboard",
                "name": "Main",
                "script": 1
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer feff2c47c678bd66948e3327f64e9a9e") //May need to use "Authorization" instead
            },
            dataType: "jsonp"
        });
    });
});

