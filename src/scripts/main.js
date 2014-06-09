'use strict';

// Theirs
var m = require('mori');
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
initialState = m.hash_map(
  'user', null,
  'plans', m.vector()
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
stateHistory = state.scan(m.vector(), function(history, newState) {
  //
  //TODO Do we want to limit this?
  //
  return m.conj(history, newState);
});

// Render trigger stream
//
// A stream of events upon which we will execute the render.
// If we have requestAnimationFrame available, we will be controlled by that,
// else we are throttled to the timeout set in the raf polyfill.
//
// We are ‘watching’ for changes (including the initial value) of our state
// property, irrespective of the mutateStream.
//
// Using `flatMapFirst` means that while we are waiting for the `raf`
// callback, we discard any other events on the `state` stream.
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
 * @param {object} state The state object to render
 */
function render(state) {
  React.renderComponent(
    new App({
      //greeting: 'Well hello',
      user: m.get_in(state, ['user'])
    }),
    document.body
  );
}

// Execute the render for each new renderStream event
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

setTimeout(function() {
  mutate(['user'], function() {
    return m.hash_map('name', 'Horatio');
  });
}, 2000);

setTimeout(function() {
  mutate(['user'], function(old) {
    return m.update_in(old, ['name'], function(name) {
      return 'Mr ' + name;
    });
  });
}, 5000);
