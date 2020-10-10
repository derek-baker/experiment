'use strict';

const http = require('http');
// @ts-ignore
const httpProxy = require('loadfire');
const PriorityOptions = require('./PriorityOptions').PriorityOptions;
const PriorityQueue = require('./PriorityQueue').PriorityQueue;
// const httpProxy = require('./LoadBalancing-Proxy/Proxy/index');

/**
 * @param {number} reverseProxyPort 
 * @param {Array<string>} appServerPorts 
 * @param {number} priorityOption 
 * @param {string} priorityHeader 
 */
const StartLoadBalancer = (
    reverseProxyPort,    
    appServerPorts,
    priorityOption = PriorityOptions.None,
    priorityHeader = 'db-x-priority'
) => {
    const priorityQueue = new PriorityQueue();

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

                    let prioritizedResponse = response;
                    let responseToProcess;
                    if (priorityOption !== PriorityOptions.None) {
                        
                        const requestPriority = 
                            (priorityOption === PriorityOptions.Prioritized) 
                                ? Number(request.headers[priorityHeader]) 
                                : PriorityOptions.Uniform;
                        // At this point, the load balancing algorithm has chosen this server,
                        // but we want to prioritize requests.
                        priorityQueue.Enqueue(
                            response, 
                            requestPriority
                        );
                        responseToProcess = priorityQueue.Dequeue()
                        if (responseToProcess) {
                            prioritizedResponse = responseToProcess.Response;
                        }
                    }
                    try {
                        prioritizedResponse.setHeader('content-type', 'application/json');
                        prioritizedResponse.writeHead(200);
                        prioritizedResponse.end(
                            `{ "server": ${port}, "priority": ${responseToProcess.Priority}, "timestamp" : ${getTimestamp()} }`
                        );
                        console.log(getTimestamp());
                    }
                    catch (err) {
                        console.error(err);
                        prioritizedResponse.writeHead(500);
                        prioritizedResponse.end();
                    }
                }
            );    
            server.listen(port);
        }
    );

    const proxyConfig = {
        'resources': [{
            selector: httpProxy.selectors.host(`localhost:${reverseProxyPort}`),
            backends: appServersConfig,
            balancer: httpProxy.balancers.roundrobin // random, roundrobin
        }],
        port: reverseProxyPort
    }

    const loadBalancer = httpProxy.createServer(proxyConfig);
    loadBalancer.run();
}

module.exports = { StartLoadBalancer };