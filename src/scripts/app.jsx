'use strict';

var React = require('react');
var m = require('mori');
var immutableMixin = require('./immutable-mixin');

module.exports = React.createClass({
  tagName: 'Blah',
  mixins: [immutableMixin],

  render: function() {
    return (
      <h1>Hello {m.get(this.props.user, 'name', 'there')}</h1>
    )
  }
});
