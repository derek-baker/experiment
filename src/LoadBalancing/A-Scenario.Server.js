// TODO: Args for port

'use strict';

const server = require('../HttpServer');

const port = 8081;

console.log('Server listening at http://localhost:' + port);
server.StartServer(port);