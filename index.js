var WebSocketServer = require('websocket').server;
var http = require('http');
var path = require('path');
var fs = require('fs');
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
	//response.readFile('webSocket.html');
	
			response.end();
		
    
});
server.listen(80, function() {
    console.log((new Date()) + ' Server is listening on port 8011');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production 
    // applications, as it defeats all standard cross-origin protection 
    // facilities built into the protocol and the browser.  You should 
    // *always* verify the connection's origin and decide whether or not 
    // to accept it. 
    autoAcceptConnections: false
});
 /*wsServer.connections = [];
 wsServer.broadcast = (data) =>{
     wsServer.connections.forEach(client) => client.sendUTF(data);
 };*/
 
	 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true;
}
 
wsServer.on('request', function(request) {
	
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin 
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('arduino', request.origin);
    console.log((new Date()) + ' Connection accepted.');
	/*if (wsServer.connections.indexOf(connection) < 0)
		wsServer.connections.push(connection);*/
    
	connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
		   wsServer.broadcast(message.utf8Data)
           //connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
           //connection.sendBytes(message.binaryData);
        }
    });
    
	connection.on('close', function(reasonCode, description) {
		/*if (wsServer.connections.indexOf(connection) <= 0)
			wsServer.connections.splice(wsServer.connections.indexOf(connection));*/
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
	
	//connection.sendUTF("Hallo Client!");
	//setInterval(() => connection.sendUTF( new Date().toTimeString()), 1000);
});
