'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('take', function() {

  eq(typeof S.take, 'function');
  eq(S.take.length, 2);
  eq(S.take.toString(), 'take :: Integer -> List a -> Maybe (List a)');

  eq(S.take(0, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.take(1, [1, 2, 3, 4, 5]), S.Just([1]));
  eq(S.take(2, [1, 2, 3, 4, 5]), S.Just([1, 2]));
  eq(S.take(3, [1, 2, 3, 4, 5]), S.Just([1, 2, 3]));
  eq(S.take(4, [1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4]));
  eq(S.take(5, [1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4, 5]));
  eq(S.take(6, [1, 2, 3, 4, 5]), S.Nothing);

  eq(S.take(0, '12345'), S.Just(''));
  eq(S.take(1, '12345'), S.Just('1'));
  eq(S.take(2, '12345'), S.Just('12'));
  eq(S.take(3, '12345'), S.Just('123'));
  eq(S.take(4, '12345'), S.Just('1234'));
  eq(S.take(5, '12345'), S.Just('12345'));
  eq(S.take(6, '12345'), S.Nothing);

  eq(S.take(-1, [1, 2, 3, 4, 5]), S.Nothing);

});
