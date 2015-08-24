/*
 * A simple webserver in Node.js / Io.js
 * Example at http://nodeio.ninja/http/simple-web-server-in-node-js/
 */

//Include the in-built http module from Node.js.
var http = require('http');

/* 
 * Create a server that listens on port 8001.
 * Provides a callback function to handle each request the server receives.
 */
http.createServer(function (req, res) {
  /*
   * This is the callback function that handles each request.
   * Request data is stored in req, the response object is stored as res.
   */
	 
  //Log to the console that our request has been received.
  console.log("Request received: " + req.url);
	
	//Send a simple HTTP header that declares our response as text.
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  //Write the actual HTTP data and end the response.
  res.end("Hello, world!");
  
}).listen(3000);
console.log("HTTP server is now operating, browse to http://localhost:3000/");