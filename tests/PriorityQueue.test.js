'use strict';

/**
 * @type {import('./typedefs').assert}
 */
const assert = require('assert');
const mocha = require('mocha');
const PriorityOptions = require('../src/PriorityOptions').PriorityOptions;
const PriorityQueue = require('./../src/PriorityQueue').PriorityQueue;

mocha.describe('PriorityQueue', () => {

    mocha.describe('Constructor', () => {
        mocha.it('should return expected', 
        () => {
            // Arrange
            const expected = true;
            const pq = new PriorityQueue();

            // Act
            const actual = pq instanceof PriorityQueue;
            
            // Assert
            assert.strictEqual(actual, expected);
        });
    });

    mocha.describe('Enqueue()', () => {
        mocha.it('should perform expected', 
        () => {
            // Arrage
            const expected = 1;
            const pq = new PriorityQueue();

            // Act            
            pq.Enqueue({}, PriorityOptions.None);
            const actual = pq;
            
            // Assert
            assert.strictEqual(actual.queue.length, expected);
        });
    });

    mocha.describe('Dequeue()', () => {
        mocha.it('should return expected', 
        () => {
            // Arrage
            const expected = PriorityOptions.None;
            const pq = new PriorityQueue();
            pq.Enqueue({}, expected);

            // Act                        
            const actual = pq.Dequeue();
            
            // Assert
            if (actual) {
                assert.strictEqual(
                    actual.Priority, 
                    expected
                );
            }
        });
    });

});
