var app = require('express')();
var http = require('http').Server(app);
var redis = require('redis');



var bodyParser = require('body-parser');	

var redisClient = redis.createClient({host : 'localhost', port : 6379});

redisClient.on("ready", function(){
	console.log("Redis babu is ready !");
});

redisClient.on("error", function(){
	console.log("Redis babu has an error!");
});


app.use(bodyParser.json({ extended: true })); 




app.post('/', function(req, res){
	var message = req.body;
	/*redisClient.pubsub('channels', function(err, channels){
		console.log("Available channels: " + channels);
		channelArray = chennels;
	});*/
	redisClient.get(message.userId, function(err, reply){
		console.log("Finding channel for user: " + message.userId);
		if(reply){
			console.log("Found channel: " + reply);
			redisClient.publish(reply, JSON.stringify(message));	
		}
		
	});
	res.json({
			"status" : 'OK'
		});
	});
	


http.listen(3000, function(){
	console.log("Listening at localhost:3000");
	
});

