'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return React.DOM.h1({}, this.props.greeting + ' ' + this.props.name);
  }
});
