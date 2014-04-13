function createLeaderBoard ()
{
    $.ajax({
        url: 'https://api.isaacloud.com/v1/queues/events',
        type: 'post',
        data: {
                "actionTime": 1390236383512, 
                "body": { "buttonLabel" : "PurchaseButton" }, 
                "clientId": 1, "data": {}, 
                "progress": 1, 
                "sourceId": 1, 
                "priority" : "PRIORITY_HIGH", 
                "status": 0, 
                "subjectId": 1, 
                "subjectType": "USER", 
                "type": "NORMAL"
              },
	 headers: {
              'Authorization': 'Bearer Njg6Mzg5YTgzYTAzMTk5YThkYjhjODdiYTg4Zjc4OGU=',
              "Content-Type": 'application/json'
        },
    dataType: 'json',
    });
}

