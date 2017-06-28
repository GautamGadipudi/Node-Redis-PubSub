//Create a node JS server
var app = require('express')();
var http = require('http').Server(app);
http.listen(3001, function(){
	console.log("Listening at localhost:3001");
});

var redis = require('redis');

var bodyParser = require('body-parser');
var io = require('socket.io').listen(http);
var uuidv4 = require('uuid/v4');


var userChannel = uuidv4();
var users = {}
var sockArray = {}

var redisSubscriber = redis.createClient({host : 'localhost', port : 6379});
var redisClient = redis.createClient({host : 'localhost', port : 6379});

redisSubscriber.on("ready", function(){
	console.log("Redis babu is ready !");
});
redisSubscriber.on("error", function(e){
	console.log("Redis babu has an error!",e); 
});

redisSubscriber.on("message", function(channel, redisMessage){
	redisMessage = JSON.parse(redisMessage);
	console.log('fetching socket for id :: ',redisMessage.userId)
	var clientSocketId = users[redisMessage.userId];
	
	if(clientSocketId) {
		console.log('socket is :: ',clientSocketId);
		console.log('sending message to client socket')
		var clientSocket = sockArray[clientSocketId]
		clientSocket.emit('message', redisMessage.payload)
		console.log('sent message to client socket')
	}
	else{
		console.log('Socket not found for user: ' + redisMessage.userId);
	}
});

redisSubscriber.subscribe(userChannel);

app.use(bodyParser.json({ extended: true })); 


app.get('/myChannel', function(req, res){
	res.sendfile('subscriber.html');
});


//Whenever someone connects this gets executed
io.on('connection', function(sock){
	//var username;
	sock.on('toSocketConnection', function(message) {
		if(message.type === 'CLIENT_ID') {
			

			//Assigning unique channel to a user
			//userChannel[message.payload] = uuidv4();
			console.log("Channel id for "+ message.payload + " : " + userChannel);
			redisClient.set(message.payload, userChannel);
			
			users[message.payload] = sock.id;
			sock.user = message.payload;
			sockArray[sock.id] = sock;
			console.log("Socket id for "+ message.payload + " : " + users[message.payload]);
		}
	});
	
	//Whenever someone disconnects this piece of code executed
	sock.on('disconnect', function () {
		var username = sock.user;
		console.log(username + " disconnected");
		delete users[username];
		console.log("Connected users: " + JSON.stringify(users));
	});

	console.log('client connected with id :: ',sock.id)
});






