'use strict';

// Theirs
var mori = require('mori');
var raf = require('raf');
var React = require('react');
var Bacon = require('baconjs');

// Ours
var Mutator = require('./mutator');

// Views
var App = require('./app.jsx');

// Local
var mutator;
var initialState;
var state;
var stateHistory;
var mutateStream;
var renderTriggerStream;
var renderStream;

// Starting state
initialState = mori.hash_map(
  'user', null,
  'plans', mori.vector()
);

// Mutator
mutator = new Mutator(initialState);

// EventStream for every mutation, with detailed payload including previous and
// new states, and a human-readable message.
mutateStream = Bacon.fromEventTarget(mutator, 'change');

// Our global state (Bacon Property)
state = mutateStream
  .map('.state')
  .toProperty(initialState);

// State History is a mori vector accumulating all the state changes
stateHistory = state.scan(mori.vector(), function(history, newState) {
  //
  //TODO Do we want to limit this?
  //
  return mori.conj(history, newState);
});

// Render trigger stream
//
// A stream of events upon which we execute the render.
// If we have requestAnimationFrame available, we will be controlled by that,
// else we are throttled to the timeout set in the raf polyfill.
//
// We are ‘watching’ for changes (including the initial value) of our state
// property, irrespective of the mutateStream.
renderTriggerStream = state
  .toEventStream()
  .flatMapFirst(function() {
    return Bacon.fromCallback(function(cb) {
      // requestAnimationFrame polyfill
      raf(function() {
        cb();
      });
    });
  });

// Render stream is a throttled stream of states that we actually want to render
renderStream = state.sampledBy(renderTriggerStream);

/**
 * Render the root component with the given state
 */
function render(state) {
  React.renderComponent(
    new App({
      //greeting: 'Well hello',
      user: mori.get_in(state, ['user'])
    }),
    document.body
  );
}

// Execute the render
renderStream.onValue(render);


/**
 * Dirty bits
 * ==========
 */


// Export React to the window object to use React DevTools
window.React = React;


/**
 * Bits that need refactoring
 * ==========================
 */

// For now we have a global mutate function before our dispatcher is in place
function mutate(path, fn, msg) {
  mutator.mutate(path, fn, msg);
}


/**
 * Debug
 * =====
 */

//renderStream.onValue(function() {
//  console.log('Rendering');
//});
//mutateStream.onValue(function() {
//  console.log('Mutating');
//});

var interval = setInterval(function() {
  mutate(['user'], function() {
    return mori.hash_map('name', 'Naomi');
  });
}, 8);
setTimeout(function() {
  clearInterval(interval);
}, 2000);

setTimeout(function() {
  mutate(['user'], function() {
    return mori.hash_map('name', 'Naomi');
  });
}, 5500);

setTimeout(function() {
  mutate(['user'], function(old) {
    return mori.update_in(old, ['name'], function(name) {
      return name + ' ' + name;
    });
  });
}, 11000);




//$(document).ready(function () {
//  var clicks, counter;
//
//  clicks = Bacon.fromEventTarget($('h1'), 'click').map(1);
//  counter = clicks.scan(0, function(a, b) {
//    return a + b;
//  });
//
//  clicks.onValue(function(value) {
//    console.log('You clicked the title');
//  });
//
//  counter.assign($('p'), 'text');
//});
