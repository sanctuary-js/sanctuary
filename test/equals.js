'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('equals', function() {

  eq(typeof S.equals, 'function');
  eq(S.equals.length, 2);
  eq(S.equals.toString(), 'equals :: Setoid a => a -> a -> Boolean');

  eq(S.equals(S.Nothing, S.Nothing), true);
  eq(S.equals(S.Just(NaN), S.Just(NaN)), true);
  eq(S.equals(S.Just(0), S.Just(-0)), false);
  eq(S.equals(S.Left(NaN), S.Left(NaN)), true);
  eq(S.equals(S.Left(0), S.Left(-0)), false);
  eq(S.equals(S.Right(NaN), S.Right(NaN)), true);
  eq(S.equals(S.Right(0), S.Right(-0)), false);

});
