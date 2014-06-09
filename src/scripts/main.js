'use strict';

// Libs
var _ = require('lodash');
var mori = require('mori');

// Views
var React = require('react');
var App = require('./app.jsx');

window.React = React;

// Vars
var state;
var stateHistory;
var renderIsQueued = false;
var scheduleRender;

// State
state = mori.hash_map(
  'user', null,
  'plans', mori.vector()
);

// State History
stateHistory = mori.vector();

/**
 * Perform a render of the global state. Shouldn’t be used directly,
 * render() should be used instead.
 */
function renderNow() {
  console.log('renderNow');
  React.renderComponent(
    new App({
      //greeting: 'Well hello',
      user: mori.get_in(state, ['user'])
    }),
    document.body
  );

  // Clear queue (in case we are using a queue)
  renderIsQueued = false;
}

/**
 * Schedule the rendering
 * @returns {function}
 */
scheduleRender = _.memoize(function() {
  if (window.requestAnimationFrame) {
    return function() {
      console.log('requestAnimationFrame()')
      window.requestAnimationFrame(renderAll);
    };
  } else {
    return function() {
      setTimeout(renderAll, 16);
    };
  }
})();

/**
 * Queue up the render. This is the function that should be called when a
 * re-render is required.
 */
function queueRender() {
  console.log('queueRender');
  // Already queued
  if (renderIsQueued) {
    console.log('ignoring');
    return;
  }

  scheduleRender();

  renderIsQueued = true;
}

/**
 * Transact!
 * Updates the global state object at the given path, adds the old state to
 * stateHistory, and triggers a re-render.
 * @param {object} lens Not yet implemented
 * @param {string|string[]} path path to data being updated
 * @param {function} fn Transformation function, will be passed old data at the path
 * @param {string} msg Message
 */
function transact(lens, path, fn, msg) {

  // Ensure path is an array
  if (_.isString(path)) {
    path = [path];
  }

  console.log('Transacting', mori.clj_to_js(path));

  // Add current state to history
  stateHistory = mori.conj(stateHistory, state);

  // Update global state object
  state = mori.update_in(state, path, fn);

  // Re-render
  render(state);
}

// Render our app
render(state);












// DEBUG
var interval = setInterval(function() {
  transact(state, ['user'], function() {
    return mori.hash_map('name', 'Naomi');
  });
}, 8);
setTimeout(function() {
  clearInterval(interval);
}, 2000);

setTimeout(function() {
  transact(state, ['user'], function() {
    return mori.hash_map('name', 'Naomi');
  });
}, 5500);

setTimeout(function() {
  transact(state, ['user'], function(old) {
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
