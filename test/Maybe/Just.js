'use strict';

var FL = require('fantasy-land');
var Z = require('sanctuary-type-classes');

var S = require('../internal/sanctuary');

var Useless = require('../internal/Useless');
var eq = require('../internal/eq');


suite('Just', function() {

  test('data constructor', function() {
    eq(typeof S.Just, 'function');
    eq(S.Just.length, 1);
    eq(S.Just(42).constructor, S.Maybe);
    eq(S.Just(42).isNothing, false);
    eq(S.Just(42).isJust, true);
  });

  test('"fantasy-land/alt" method', function() {
    eq(S.Just(1)[FL.alt].length, 1);
    eq(S.Just(1)[FL.alt](S.Nothing), S.Just(1));
    eq(S.Just(1)[FL.alt](S.Just(2)), S.Just(1));
  });

  test('"fantasy-land/ap" method', function() {
    eq(S.Just(42)[FL.ap].length, 1);
    eq(S.Just(42)[FL.ap](S.Nothing), S.Nothing);
    eq(S.Just(42)[FL.ap](S.Just(S.add(1))), S.Just(43));
  });

  test('"fantasy-land/chain" method', function() {
    eq(S.Just([1, 2, 3])[FL.chain].length, 1);
    eq(S.Just([1, 2, 3])[FL.chain](S.head), S.Just(1));
  });

  test('"fantasy-land/concat" method', function() {
    eq(S.Just('foo')[FL.concat].length, 1);
    eq(S.Just('foo')[FL.concat](S.Nothing), S.Just('foo'));
    eq(S.Just('foo')[FL.concat](S.Just('bar')), S.Just('foobar'));

    eq(Z.Semigroup.test(S.Just('abc')), true);
    eq(Z.Semigroup.test(S.Just(123)), false);
  });

  test('"fantasy-land/equals" method', function() {
    eq(S.Just(42)[FL.equals].length, 1);
    eq(S.Just(42)[FL.equals](S.Just(42)), true);
    eq(S.Just(42)[FL.equals](S.Just(43)), false);
    eq(S.Just(42)[FL.equals](S.Nothing), false);

    // Value-based equality:
    eq(S.Just(NaN)[FL.equals](S.Just(NaN)), true);
    eq(S.Just([1, 2, 3])[FL.equals](S.Just([1, 2, 3])), true);

    eq(Z.Setoid.test(S.Just(1)), true);
    eq(Z.Setoid.test(S.Just(Useless)), false);
  });

  test('"fantasy-land/extend" method', function() {
    eq(S.Just(42)[FL.extend].length, 1);
    eq(S.Just(42)[FL.extend](function(x) { return x.value / 2; }), S.Just(21));
  });

  test('"fantasy-land/lte" method', function() {
    eq(S.Just(1)[FL.lte].length, 1);
    eq(S.Just(1)[FL.lte](S.Nothing), false);
    eq(S.Just(1)[FL.lte](S.Just(0)), false);
    eq(S.Just(1)[FL.lte](S.Just(1)), true);
    eq(S.Just(1)[FL.lte](S.Just(2)), true);

    eq(Z.Ord.test(S.Just(1)), true);
    eq(Z.Ord.test(S.Just(Math.sqrt)), false);
  });

  test('"fantasy-land/map" method', function() {
    eq(S.Just(42)[FL.map].length, 1);
    eq(S.Just(42)[FL.map](function(x) { return x / 2; }), S.Just(21));
  });

  test('"fantasy-land/reduce" method', function() {
    eq(S.Just(5)[FL.reduce].length, 2);
    eq(S.Just(5)[FL.reduce](function(x, y) { return x - y; }, 42), 37);
  });

  test('"toString" method', function() {
    eq(S.Just([1, 2, 3]).toString.length, 0);
    eq(S.Just([1, 2, 3]).toString(), 'Just([1, 2, 3])');
  });

  test('"inspect" method', function() {
    eq(S.Just([1, 2, 3]).inspect.length, 0);
    eq(S.Just([1, 2, 3]).inspect(), 'Just([1, 2, 3])');
  });

});
