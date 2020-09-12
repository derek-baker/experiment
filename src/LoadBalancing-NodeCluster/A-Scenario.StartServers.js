// USAGE: node ./A-Scenario.Server.js 8080 
// DOCS: https://nodejs.org/api/cluster.html
/*
    The cluster module supports two methods of distributing incoming connections.
    The first one (and the default one on all platforms except Windows), is the 
    round-robin approach, where the master process listens on a port, accepts new 
    connections and distributes them across the workers in a round-robin fashion, 
    with some built-in smarts to avoid overloading a worker process.
    SOURCE: https://nodejs.org/api/cluster.html#cluster_how_it_works
*/

'use strict';

const server = require('../HttpServer');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;

// Parsing of args in this way requires you follow the usage above.
const loadBalancerPort = process.argv.slice(2)[0];

cluster.schedulingPolicy = cluster.SCHED_RR; // XOR cluster.SCHED_NONE
// cluster.setupMaster({
//     exec: 'worker.js',
//     args: ['--use', 'https'],
//     silent: true
// });

if (cluster.isMaster) {
    console.log(`Cluster main process has PID ${process.pid}`);
    // Create N workers, where N is equal to the number of CPUs on the host.
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
    cluster.on(
        'exit',
        (worker, code, signal) => {
            console.log(
                `Worker with PID ${worker.process.pid} has exited with code ${code} and signal ${signal}.`
            );
            // We could restart a worker to replace the last one.
            // cluster.fork();
        }
    )
}
else {
    console.log('Starting worker process');
    server.StartServer(Number(loadBalancerPort));    
}

