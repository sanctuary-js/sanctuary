'use strict';

var FL = require('fantasy-land');
var Z = require('sanctuary-type-classes');

var S = require('../..');

var eq = require('../internal/eq');
var squareRoot = require('../internal/squareRoot');


suite('Left', function() {

  test('data constructor', function() {
    eq(typeof S.Left, 'function');
    eq(S.Left.length, 1);
    eq(S.Left(42).constructor, S.Either);
    eq(S.Left(42).isLeft, true);
    eq(S.Left(42).isRight, false);
  });

  test('"fantasy-land/alt" method', function() {
    eq(S.Left(1)[FL.alt].length, 1);
    eq(S.Left(1)[FL.alt](S.Left(2)), S.Left(2));
    eq(S.Left(1)[FL.alt](S.Right(2)), S.Right(2));
  });

  test('"fantasy-land/ap" method', function() {
    eq(S.Left('abc')[FL.ap].length, 1);
    eq(S.Left('abc')[FL.ap](S.Left('xyz')), S.Left('xyz'));
    eq(S.Left('abc')[FL.ap](S.Right(S.inc)), S.Left('abc'));
  });

  test('"fantasy-land/bimap" method', function() {
    eq(S.Left('abc')[FL.bimap].length, 2);
    eq(S.Left('abc')[FL.bimap](S.toUpper, S.inc), S.Left('ABC'));
  });

  test('"fantasy-land/chain" method', function() {
    eq(S.Left('abc')[FL.chain].length, 1);
    eq(S.Left('abc')[FL.chain](squareRoot), S.Left('abc'));
  });

  test('"fantasy-land/concat" method', function() {
    eq(S.Left('abc')[FL.concat].length, 1);
    eq(S.Left('abc')[FL.concat](S.Left('def')), S.Left('abcdef'));
    eq(S.Left('abc')[FL.concat](S.Right('xyz')), S.Right('xyz'));

    eq(Z.Semigroup.test(S.Left('abc')), true);
    eq(Z.Semigroup.test(S.Left(123)), false);
  });

  test('"fantasy-land/equals" method', function() {
    eq(S.Left(42)[FL.equals].length, 1);
    eq(S.Left(42)[FL.equals](S.Left(42)), true);
    eq(S.Left(42)[FL.equals](S.Left('42')), false);
    eq(S.Left(42)[FL.equals](S.Right(42)), false);

    // Value-based equality:
    eq(S.Left(0)[FL.equals](S.Left(-0)), false);
    eq(S.Left(-0)[FL.equals](S.Left(0)), false);
    eq(S.Left(NaN)[FL.equals](S.Left(NaN)), true);
    eq(S.Left([1, 2, 3])[FL.equals](S.Left([1, 2, 3])), true);
  });

  test('"fantasy-land/extend" method', function() {
    eq(S.Left('abc')[FL.extend].length, 1);
    eq(S.Left('abc')[FL.extend](function(x) { return x / 2; }), S.Left('abc'));
  });

  test('"fantasy-land/map" method', function() {
    eq(S.Left('abc')[FL.map].length, 1);
    eq(S.Left('abc')[FL.map](Math.sqrt), S.Left('abc'));
  });

  test('"fantasy-land/reduce" method', function() {
    eq(S.Left('abc')[FL.reduce].length, 2);
    eq(S.Left('abc')[FL.reduce](function(x, y) { return x - y; }, 42), 42);
  });

  test('"toString" method', function() {
    eq(S.Left('abc').toString.length, 0);
    eq(S.Left('abc').toString(), 'Left("abc")');
  });

  test('"inspect" method', function() {
    eq(S.Left('abc').inspect.length, 0);
    eq(S.Left('abc').inspect(), 'Left("abc")');
  });

});
