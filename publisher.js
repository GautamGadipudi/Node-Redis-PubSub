var app = require('express')();
var http = require('http').Server(app);
var redis = require('redis');
// var io = require('socket.io')(http);

var bodyParser = require('body-parser');	

/*io.on('connection', function(socket){
	console.log("A user connected");
	socket.on('disconnect', function(){
		console.log("A user disconnected");
	});
});*/
var redisClient = redis.createClient({host : 'localhost', port : 6379});

redisClient.on("ready", function(){
	console.log("Redis babu is ready !");
});

redisClient.on("error", function(){
	console.log("Redis babu has an error!");
});

app.use(bodyParser.json({ extended: true })); 


var transactions = [];

app.post('/', function(req, res){


	var message = req.body;
	
	transactions.push(message);
	redisClient.publish('myChannel', JSON.stringify(message));
	
		res.json({
			"status" : 'OK'
		});
	
	
});

http.listen(3000, function(){
	console.log("Listening at localhost:3000");
	
});

