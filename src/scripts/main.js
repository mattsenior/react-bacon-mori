'use strict';

// Utils
var _ = require('lodash');
var mori = require('mori');
//var $ = require('jquery');
//var Bacon = require('baconjs');

// React
var React = require('react');
var App = require('./app');

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

console.log(mori);

/**
 * Transact!
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

function render(state) {
  React.renderComponent(
    new App({
      //greeting: 'Well hello',
      user: mori.get_in(state, ['user'])
    }),
    document.body
  );
}

render(state);

var originalState = state;

setInterval(function() {
  return;
  if (originalState === state) {
    console.log('State unchanged');
  } else {
    console.log('NEW STATE');
  }

  if (mori.get_in(originalState, ['plans']) === mori.get_in(state, ['plans'])) {
    console.log('Plans unchanged');
  } else {
    console.log('PLANS CHANGED');
  }
}, 500);


setInterval(function() {
  transact(state, ['plans'], function(old) {
    return mori.conj(old, Math.random());
  });
}, 1000);

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
