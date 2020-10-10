'use strict';

class PriorityQueueElement {
    /**
     * @param {*} response 
     * @param {import('./PriorityOptions').PriorityOptions} priority 
     */
    constructor(response, priority) {
        this.Response = response;
        this.Priority = priority;
    }
}

class PriorityQueue {    
    constructor() {
        /** @type {Array<PriorityQueueElement>} */
        this.queue = [];
    }
    /**
     * https://www.geeksforgeeks.org/implementation-priority-queue-javascript/
     * @param {any} response 
     * @param {import('./PriorityOptions').PriorityOptions} priority
     */
    Enqueue(response, priority) {
        let elementIsHighestPriority = true; 
        const element = new PriorityQueueElement(response, priority);
  
        // Iterating through the entire item array to 
        // add element at the correct location of the Queue. 
        for (let i = 0; i < this.queue.length; i++) { 
            if (this.queue[i].Priority > element.Priority) { 
                // Once the correct location is found, it is enqueued. 
                this.queue.splice(i, 0, element); 
                elementIsHighestPriority = false; 
                break; 
            } 
        } 
    
        // if the element have the highest priority 
        // it is added at the end of the queue 
        if (elementIsHighestPriority === true) { 
            this.queue.push(element); 
        } 
    }
    Dequeue() {
        return this.queue.shift();
    }
}

module.exports = { PriorityQueue }
