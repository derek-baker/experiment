/**
  * @enum {number}
  */
const PriorityOptions = {
    None: 0,
    Uniform: 1,
    Prioritized: 9 // TODO
};
Object.freeze(PriorityOptions);

module.exports = { PriorityOptions };