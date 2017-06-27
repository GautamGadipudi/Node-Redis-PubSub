//Create a node JS server
var app = require('express')();
var http = require('http').Server(app);
http.listen(3001, function(){
	console.log("Listening at localhost:3001");
});

var redis = require('redis');

var bodyParser = require('body-parser');
var io = require('socket.io').listen(http);
var url = require('url') ;

var users = {}
var sockArray = {}

var redisClient = redis.createClient({host : 'localhost', port : 6379});

redisClient.on("ready", function(){
	console.log("Redis babu is ready !");
});
redisClient.on("error", function(){
	console.log("Redis babu has an error!"); 
});
redisClient.subscribe('myChannel');

redisClient.on("message", function(channel, redisMessage){
	redisMessage = JSON.parse(redisMessage);
	console.log('fetching socket for id :: ',redisMessage.userId)
	var clientSocketId = users[redisMessage.userId];
	console.log('socket is :: ',clientSocketId);
	if(clientSocketId) {
		console.log('sending message to client socket')
		var clientSocket = sockArray[clientSocketId]
		clientSocket.emit('message', redisMessage.payload)
		console.log('sent message to client socket')
	}
});

app.use(bodyParser.json({ extended: true })); 

var queryObject;

app.get('/myChannel', function(req, res){
	res.sendfile('subscriber.html');
	queryObject = url.parse(req.url,true).query;
	
});


//Whenever someone connects this gets executed
io.on('connection', function(sock){
	var username;
	sock.on('toSocketConnection', function(message) {
		if(message.type === 'CLIENT_ID') {
			username = message.payload;
			users[username] = sock.id;
			sockArray[sock.id] = sock;
			console.log(sock.id + ' is assigned to user ::' + message.payload);
		}
	});
	
	//Whenever someone disconnects this piece of code executed
	sock.on('disconnect', function () {
		console.log(username + " disconnected");
		delete users[username];
		console.log("Connected users: " + JSON.stringify(users));
	});

	console.log('client connected with id :: ',sock.id)
});






