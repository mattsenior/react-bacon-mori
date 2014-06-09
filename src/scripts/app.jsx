'use strict';

var component = require('./component');
var React = require('react');

module.exports = component({
  render: function() {
    return (
      <h1>{this.props.greeting + ' ' + this.props.user}</h1>
    )
  }
});
