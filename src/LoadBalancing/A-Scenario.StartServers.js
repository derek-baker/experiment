// USAGE: node ./A-Scenario.Server.js 8080 8081 8082

'use strict';

const server = require('../HttpServer');

// This line assumes you follow the usage above.
// This means we want to ignore the first three args.
const appServerports = process.argv.slice(3);

const loadBalancerPort = process.argv.slice(2)
console.log('Server listening at http://localhost:' + port);
server.StartServer(Number(port));


appServerports.forEach(
    /**
     * @param {string} port
     */
    (port) => {
        console.log('Server listening at http://localhost:' + port);
        server.StartServer(Number(port));
    }
)
