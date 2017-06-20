'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('drop', function() {

  eq(typeof S.drop, 'function');
  eq(S.drop.length, 2);
  eq(S.drop.toString(), 'drop :: Integer -> List a -> Maybe (List a)');

  eq(S.drop(0, [1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4, 5]));
  eq(S.drop(1, [1, 2, 3, 4, 5]), S.Just([2, 3, 4, 5]));
  eq(S.drop(2, [1, 2, 3, 4, 5]), S.Just([3, 4, 5]));
  eq(S.drop(3, [1, 2, 3, 4, 5]), S.Just([4, 5]));
  eq(S.drop(4, [1, 2, 3, 4, 5]), S.Just([5]));
  eq(S.drop(5, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.drop(6, [1, 2, 3, 4, 5]), S.Nothing);

  eq(S.drop(0, '12345'), S.Just('12345'));
  eq(S.drop(1, '12345'), S.Just('2345'));
  eq(S.drop(2, '12345'), S.Just('345'));
  eq(S.drop(3, '12345'), S.Just('45'));
  eq(S.drop(4, '12345'), S.Just('5'));
  eq(S.drop(5, '12345'), S.Just(''));
  eq(S.drop(6, '12345'), S.Nothing);

  eq(S.drop(-1, [1, 2, 3, 4, 5]), S.Nothing);

});
