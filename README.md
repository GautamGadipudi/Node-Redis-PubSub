# Node-Redis-PubSub
Using a redis server, and node js node, and socket.io, I have established a PubSub model.
Step #0
  Run the following commands in your terminal:
    npm i -s express socket.io redis body-parser

Step #1
  Run the redis server in another terminal using the command: 
    redis-server
 
Step #2
  Run the publisher server in another terminal using: 
    node publisher.js
 
Step #3
  Run the subscriber server in another terminal using:
    node subscriber.js
   
Step #4
  Open a browser and connect to the subscriber using:
    "localhost:3001/mychannel?username=yourname"
    
Step #5
  Open postman and send a POST request to "localhost:3000".
  Note: The request must be a JSON object as below:
  {
    "type": "CLIENT_ID",
    "userId" : "yourname",
    "payload": {
      "txn": "cred"
    }
  }	  
  
 Step #6
  Now in the browser console (enable logging and JS).
  You should be able to see the payload of the respective userID.
  You can also open multiple clients to the subscriber server with different usernames.
