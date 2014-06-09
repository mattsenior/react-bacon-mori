'use strict';

// Libs
var _ = require('lodash');
var mori = require('mori');

// Views
var React = require('react');
var App = require('./app.jsx');

// Vars
var state;
var stateHistory;

// State
state = mori.hash_map(
  'user', null,
  'plans', mori.vector()
);

// State History
stateHistory = mori.vector();

/**
 * Render!
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

/**
 * Transact!
 * Updates the global state object at the given path, adds the old state to
 * stateHistory, and triggers a re-render.
 * @param {object} lens Not yet implemented
 * @param {string|array} path path to data being updated
 * @param {function} f Transformation function, will be passed old data at the korks path
 */
function transact(lens, korks, f) {
  if (_.isString(korks)) {
    korks = [korks];
  }

  console.log('Transacting', mori.clj_to_js(korks));

  // Add current state to history
  stateHistory = mori.conj(stateHistory, state);

  // Update global state object
  state = mori.update_in(state, korks, f);

  // Re-render
  render(state);
}

// Render our app
render(state);












// DEBUG
setInterval(function() {
  //console.log('tick');
}, 1000);

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
