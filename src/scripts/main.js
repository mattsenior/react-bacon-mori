'use strict';

var $ = require('jquery'),
  Bacon = require('baconjs'),
  React = require('react'),
  App = require('./app');


React.renderComponent(
  new App({
    greeting: 'Well hello',
    name: 'Naomi'
  }),
  document.body
);

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
