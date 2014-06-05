var $ = require('jquery');
var Bacon = require('baconjs');

$(document).ready(function () {
  var clicks, counter;

  clicks = Bacon.fromEventTarget($('h1'), 'click').map(1);
  counter = clicks.scan(0, function(a, b) {
    return a + b;
  });

  clicks.onValue(function(value) {
    console.log('You clicked the title');
  });

  counter.assign($('p'), 'text');
});
