/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
const urlParser = require('url');


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'authorization, content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var headers = defaultCorsHeaders;
headers['Content-Type'] = 'application/json';

var messages = [];
var resultObject = { results: messages };

exports.requestHandler = function (request, response) {

  console.log('request made');

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  const url = urlParser.parse(request.url).pathname;
  if (url === '/classes/messages') {
    var result = request.url.includes('?order=-createdAt') ? messages : resultObject;

    console.log('Messages request made');


    if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();

    } else if (request.method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(result));

    } else if (request.method === 'POST') {
      request.on('data', (data) => {
        var newData = JSON.parse(data);
        newData['message_id'] = messages.length;
        messages.push(newData);

      });

      request.on('end', () => {
        response.writeHead(201, headers);
        response.end(JSON.stringify(result));
      });

    } else {
      response.writeHead(404, headers);
      response.end();
    }
  } else {
    response.writeHead(404, headers);
    response.end();
  }
};