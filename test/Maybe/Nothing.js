'use strict';

var FL = require('fantasy-land');
var Z = require('sanctuary-type-classes');

var S = require('../..');

var eq = require('../internal/eq');


suite('Nothing', function() {

  test('member of the "Maybe a" type', function() {
    eq(S.Nothing.constructor, S.Maybe);
    eq(S.Nothing.isNothing, true);
    eq(S.Nothing.isJust, false);
  });

  test('"fantasy-land/alt" method', function() {
    eq(S.Nothing[FL.alt].length, 1);
    eq(S.Nothing[FL.alt](S.Nothing), S.Nothing);
    eq(S.Nothing[FL.alt](S.Just(1)), S.Just(1));
  });

  test('"fantasy-land/ap" method', function() {
    eq(S.Nothing[FL.ap].length, 1);
    eq(S.Nothing[FL.ap](S.Nothing), S.Nothing);
    eq(S.Nothing[FL.ap](S.Just(S.add(1))), S.Nothing);
  });

  test('"fantasy-land/chain" method', function() {
    eq(S.Nothing[FL.chain].length, 1);
    eq(S.Nothing[FL.chain](S.head), S.Nothing);
  });

  test('"fantasy-land/concat" method', function() {
    eq(S.Nothing[FL.concat].length, 1);
    eq(S.Nothing[FL.concat](S.Nothing), S.Nothing);
    eq(S.Nothing[FL.concat](S.Just('foo')), S.Just('foo'));

    eq(Z.Semigroup.test(S.Nothing), true);
  });

  test('"fantasy-land/equals" method', function() {
    eq(S.Nothing[FL.equals].length, 1);
    eq(S.Nothing[FL.equals](S.Nothing), true);
    eq(S.Nothing[FL.equals](S.Just(42)), false);
  });

  test('"fantasy-land/extend" method', function() {
    eq(S.Nothing[FL.extend].length, 1);
    eq(S.Nothing[FL.extend](function(x) { return x.value / 2; }), S.Nothing);
  });

  test('"fantasy-land/map" method', function() {
    eq(S.Nothing[FL.map].length, 1);
    eq(S.Nothing[FL.map](function() { return 42; }), S.Nothing);
  });

  test('"fantasy-land/reduce" method', function() {
    eq(S.Nothing[FL.reduce].length, 2);
    eq(S.Nothing[FL.reduce](function(x, y) { return x - y; }, 42), 42);
  });

  test('"toString" method', function() {
    eq(S.Nothing.toString.length, 0);
    eq(S.Nothing.toString(), 'Nothing');
  });

  test('"inspect" method', function() {
    eq(S.Nothing.inspect.length, 0);
    eq(S.Nothing.inspect(), 'Nothing');
  });

});
