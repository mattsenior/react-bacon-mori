'use strict';

//var $ = require('jquery');
//var Bacon = require('baconjs');
//var React = require('react');
//var App = require('./app');

var mori = require('mori');

console.log(mori);
console.log('heya');

//console.log('hello');

// App state
//var state = mori.hash_map(
//  'user', null,
//  'plans', mori.vector()
//);

//console.log(state);


//React.renderComponent(
//  new App({
//    greeting: 'Well hello',
//    name: 'Naomi'
//  }),
//  document.body
//);

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
