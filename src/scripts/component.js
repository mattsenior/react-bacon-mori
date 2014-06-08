'use strict';

var React = require('react');
var mori = require('mori');
var _ = require('lodash');

/**
 * Is there a difference between the current and new objects?
 * If every property of the current object is a mori collection and has not
 * changed, we can return a definite false. Otherwise, we return true,
 * without doing any sort of value checking.
 * @param {object} current Object of current props or state
 * @param {object} next Object of next props or state
 * @returns {boolean}
 */
function hasChanged(current, next) {
  return _.some(current, function(value, key) {
    // Always update if we’re not dealing with a mori collection
    if (!mori.is_collection(value)) return true;

    // Trigger update if referential equality fails
    return value !== next[key];
  });
}

/**
 * Create a new React component with our default options
 * @param {?object} opts React component spec
 * @returns {objct} Result of React.createClass;
 */
function component(opts) {
  return React.createClass(_.merge({
    // If we return false from shouldComponentUpdate we can prevent React from
    // re-rendering this component. Its default is to return true and run render,
    // which of course may still not affect the DOM.
    //
    // If we have any props that _aren’t_ mori collections, we can use the
    // default behaviour and just render the component. No need to check for
    // value equality, probably wouldn’t be worth it.
    //
    // On the other hand, if **all** of the props are mori collections and have
    // not changed (from a quick referential check (===)), we can return false to
    // prevent the render.
    shouldComponentUpdate: function(nextProps, nextState) {
      return _.some(
        [[this.props, nextProps], [this.state, nextState]],
        function(currentAndNext) {
          return hasChanged.apply(this, currentAndNext);
        }
      );
    }
  }, opts));

}

module.exports = component;
