'use strict';

var FL = require('fantasy-land');

var S = require('../..');

var eq = require('../internal/eq');
var squareRoot = require('../internal/squareRoot');


suite('Right', function() {

  test('data constructor', function() {
    eq(typeof S.Right, 'function');
    eq(S.Right.length, 1);
    eq(S.Right(42)['@@type'], 'sanctuary/Either');
    eq(S.Right(42).constructor, S.Either);
    eq(S.Right(42).isLeft, false);
    eq(S.Right(42).isRight, true);
  });

  test('"fantasy-land/alt" method', function() {
    eq(S.Right(1)[FL.alt].length, 1);
    eq(S.Right(1)[FL.alt](S.Left(2)), S.Right(1));
    eq(S.Right(1)[FL.alt](S.Right(2)), S.Right(1));
  });

  test('"fantasy-land/ap" method', function() {
    eq(S.Right(42)[FL.ap].length, 1);
    eq(S.Right(42)[FL.ap](S.Left('abc')), S.Left('abc'));
    eq(S.Right(42)[FL.ap](S.Right(S.inc)), S.Right(43));
  });

  test('"fantasy-land/bimap" method', function() {
    eq(S.Right(42)[FL.bimap].length, 2);
    eq(S.Right(42)[FL.bimap](S.toUpper, S.inc), S.Right(43));
  });

  test('"fantasy-land/chain" method', function() {
    eq(S.Right(25)[FL.chain].length, 1);
    eq(S.Right(25)[FL.chain](squareRoot), S.Right(5));
  });

  test('"fantasy-land/concat" method', function() {
    eq(S.Right('abc')[FL.concat].length, 1);
    eq(S.Right('abc')[FL.concat](S.Left('xyz')), S.Right('abc'));
    eq(S.Right('abc')[FL.concat](S.Right('def')), S.Right('abcdef'));
  });

  test('"fantasy-land/equals" method', function() {
    eq(S.Right(42)[FL.equals].length, 1);
    eq(S.Right(42)[FL.equals](S.Right(42)), true);
    eq(S.Right(42)[FL.equals](S.Right('42')), false);
    eq(S.Right(42)[FL.equals](S.Left(42)), false);

    // Value-based equality:
    eq(S.Right(0)[FL.equals](S.Right(-0)), false);
    eq(S.Right(-0)[FL.equals](S.Right(0)), false);
    eq(S.Right(NaN)[FL.equals](S.Right(NaN)), true);
    eq(S.Right([1, 2, 3])[FL.equals](S.Right([1, 2, 3])), true);
  });

  test('"fantasy-land/extend" method', function() {
    eq(S.Right(42)[FL.extend].length, 1);
    eq(S.Right(42)[FL.extend](function(x) { return x.value / 2; }), S.Right(21));
  });

  test('"fantasy-land/map" method', function() {
    eq(S.Right(9)[FL.map].length, 1);
    eq(S.Right(9)[FL.map](Math.sqrt), S.Right(3));
  });

  test('"fantasy-land/reduce" method', function() {
    eq(S.Right(5)[FL.reduce].length, 2);
    eq(S.Right(5)[FL.reduce](function(x, y) { return x - y; }, 42), 37);
  });

  test('"toString" method', function() {
    eq(S.Right([1, 2, 3]).toString.length, 0);
    eq(S.Right([1, 2, 3]).toString(), 'Right([1, 2, 3])');
  });

  test('"inspect" method', function() {
    eq(S.Right([1, 2, 3]).inspect.length, 0);
    eq(S.Right([1, 2, 3]).inspect(), 'Right([1, 2, 3])');
  });

});
