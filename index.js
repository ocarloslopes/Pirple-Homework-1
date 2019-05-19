/*
 * Homework #1
 * It's a restful JSON API that listens to port 3000
 * And returns a message when someone calls the /hello route
 *
 */
var http = require('http');
var url = require('url');

var server = http.createServer(function(req, res) {
    // Here we parse the URL
    var parsedUrl = url.parse(req.url, true);

    // get the path, so we can know if /hello is called
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // I found out the hard way that req.on('end') needs req.on('data'), so we need to have this
    req.on('data', function() {});

    // here the response is sent back to the client
    req.on('end', function() {
        // If it's not the /hello endpoint, it will return a 404 error
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Here we call the specified handler (or 404 error)
        chosenHandler(function(statusCode, response) {
            // Status code defaults to 200 if none
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Return the response from the handler or an empty object, if none
            response = typeof(response) == 'object' ? response : {};

            // can't return a JSON object, so we convert it to a string
            var responseString = JSON.stringify(response);

            // Response
            res.setHeader('Content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(responseString);

            // Log the request path
            console.log('Returning this response: ', statusCode, responseString);
        });
    });
});

// Start the server
server.listen(3000, function() {
    console.log("The server is listenning on port 3000");
});

// Define the handlers
var handlers = {};

// Hello handler
handlers.hello = function(callback) {
    var message = {
        "message": "Hello there, this is my first homework"
    };
    callback(200, message);
};


// Not found handler
handlers.notFound = function(callback) {
    callback(404);
};

// Define a request router
var router = {
    'hello': handlers.hello
};