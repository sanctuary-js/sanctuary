'use strict';

var FL = require ('fantasy-land');
var Z = require ('sanctuary-type-classes');

var S = require ('../internal/sanctuary');

var eq = require ('../internal/eq');


suite ('Nothing', function() {

  test ('member of the "Maybe a" type', function() {
    eq (S.Nothing.constructor) (S.Maybe);
    eq (S.Nothing.isNothing) (true);
    eq (S.Nothing.isJust) (false);
  });

  test ('"fantasy-land/alt" method', function() {
    eq (S.Nothing[FL.alt].length) (1);
    eq (S.Nothing[FL.alt] (S.Nothing)) (S.Nothing);
    eq (S.Nothing[FL.alt] (S.Just (1))) (S.Just (1));
  });

  test ('"fantasy-land/ap" method', function() {
    eq (S.Nothing[FL.ap].length) (1);
    eq (S.Nothing[FL.ap] (S.Nothing)) (S.Nothing);
    eq (S.Nothing[FL.ap] (S.Just (S.add (1)))) (S.Nothing);
  });

  test ('"fantasy-land/chain" method', function() {
    eq (S.Nothing[FL.chain].length) (1);
    eq (S.Nothing[FL.chain] (S.head)) (S.Nothing);
  });

  test ('"fantasy-land/concat" method', function() {
    eq (S.Nothing[FL.concat].length) (1);
    eq (S.Nothing[FL.concat] (S.Nothing)) (S.Nothing);
    eq (S.Nothing[FL.concat] (S.Just ('foo'))) (S.Just ('foo'));

    eq (Z.Semigroup.test (S.Nothing)) (true);
  });

  test ('"fantasy-land/equals" method', function() {
    eq (S.Nothing[FL.equals].length) (1);
    eq (S.Nothing[FL.equals] (S.Nothing)) (true);
    eq (S.Nothing[FL.equals] (S.Just (42))) (false);

    eq (Z.Setoid.test (S.Nothing)) (true);
  });

  test ('"fantasy-land/extend" method', function() {
    eq (S.Nothing[FL.extend].length) (1);
    eq (S.Nothing[FL.extend] (function(x) { return x.value / 2; })) (S.Nothing);
  });

  test ('"fantasy-land/lte" method', function() {
    eq (S.Nothing[FL.lte].length) (1);
    eq (S.Nothing[FL.lte] (S.Nothing)) (true);
    eq (S.Nothing[FL.lte] (S.Just (0))) (true);

    eq (Z.Ord.test (S.Nothing)) (true);
  });

  test ('"fantasy-land/map" method', function() {
    eq (S.Nothing[FL.map].length) (1);
    eq (S.Nothing[FL.map] (function() { return 42; })) (S.Nothing);
  });

  test ('"fantasy-land/reduce" method', function() {
    eq (S.Nothing[FL.reduce].length) (2);
    eq (S.Nothing[FL.reduce] (function(x, y) { return x - y; }, 42)) (42);
  });

  test ('"@@show" method', function() {
    eq (S.show (S.Nothing)) ('Nothing');
  });

});
