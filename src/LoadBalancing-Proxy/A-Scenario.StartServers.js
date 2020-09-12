// USAGE: node ./A-Scenario.Server.js <PROXY_PORT> <SERVER_PORT> <SERVER_PORT>
// EXAMPLE: node ./A-Scenario.Server.js 8080 8081 8082 

// USAGE: node ./A-Scenario.Server.js <PROXY_PORT> <SERVER_PORT> <SERVER_PORT> <SERVER_PORT>
// EXAMPLE: node ./A-Scenario.Server.js 8080 8081 8082 8083

'use strict';

const server = require('../HttpServer');
const PriorityOptions = require('../PriorityOptions').PriorityOptions;

// Parsing of args in this way requires you follow the usage above.
const loadBalancerPort = process.argv.slice(2)[0];
const appServerports = process.argv.slice(3);

// server.StartLoadBalancer(Number(loadBalancerPort), appServerports);

// server.StartLoadBalancer(Number(loadBalancerPort), appServerports, PriorityOptions.Uniform);

server.StartLoadBalancer(Number(loadBalancerPort), appServerports, PriorityOptions.Prioritized);

