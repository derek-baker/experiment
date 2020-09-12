'use strict';

const http = require('http');

const StartServer = (port = 8080) => {
    const server = http.createServer(    
        (request, response) => {
            const getTimestamp = () => new Date().getTime();
    
            try {
                response.setHeader('content-type', 'application/json');
                response.writeHead(200);
                response.end(
                    `{ 'timestamp' : ${getTimestamp()} }`
                );
                console.log(getTimestamp());
            }
            catch (err) {
                console.error(err);
                response.writeHead(500);
                response.end();
            }
        }
    );    
    server.listen(port);
}

module.exports = { StartServer };