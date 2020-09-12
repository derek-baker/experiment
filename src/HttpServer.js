'use strict';

const http = require('http');
// @ts-ignore
const httpProxy = require('loadfire');

/**
 * https://github.com/http-party/node-http-proxy#setup-a-stand-alone-proxy-server-with-custom-server-logic
 * @param {number} reverseProxyPort 
 * @param {Array<string>} appServerPorts 
 */
const StartLoadBalancer = (
    reverseProxyPort,    
    appServerPorts
) => {
    const appServersConfig = appServerPorts.map(
        (port) => {
            return {
                host: 'localhost',
                port: port
            }
        }
    );

    // Start app servers
    appServerPorts.forEach(
        (port) => {
            console.log(`Starting server on port: ${port}`);
            const server = http.createServer(    
                (request, response) => {
                    const getTimestamp = () => new Date().getTime();
            
                    try {
                        response.setHeader('content-type', 'application/json');
                        response.writeHead(200);
                        response.end(
                            `{ "server": ${port}, "timestamp" : ${getTimestamp()} }`
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
    );

    const host = httpProxy.selectors.host(`localhost:${reverseProxyPort}`);
    const proxyConfig = {
        'resources': [{
            selector: host,
            backends: appServersConfig,
            balancer: httpProxy.balancers.roundrobin // random, roundrobin
        }],
        port: reverseProxyPort
    }

    const loadBalancer = httpProxy.createServer(proxyConfig);
    loadBalancer.run();
}

module.exports = { StartLoadBalancer };