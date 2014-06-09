'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('lodash');
var mori = require('mori');

function Mutator(state) {

  // Parent constructor
  EventEmitter.call(this);

  // Store state
  this.state     = state;

  // And a reference to the previous state, included in change events
  this.prevState = null;
}

util.inherits(Mutator, EventEmitter);

/**
 * Mutate!
 * Updates the global state object at the given path, emitting a change event
 * @param {string|string[]} path Path to data being updated
 * @param {function} fn Transformation function, will be passed old data at the path
 * @param {string} msg Message used for history log etc.
 */
Mutator.prototype.mutate = function(path, fn, msg) {
  // Ensure path is an array
  if (_.isString(path)) {
    path = [path];
  }

  // Update previous state reference
  this.prevState = this.state;

  // Update state
  this.state = mori.update_in(this.state, path, fn);

  // Emit a change event with a reference payload
  this.emit('change', {
    state: this.state,
    prevState: this.prevState,
    path: path,
    msg: msg
  });
};

module.exports = Mutator;
