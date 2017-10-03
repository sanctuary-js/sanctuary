const jsc = require('jsverify');

import * as S from '..';

import eq from './internal/eq';


test('groupBy', () => {

  eq(typeof S.groupBy, 'function');
  eq(S.groupBy.length, 2);
  eq(S.groupBy.toString(), 'groupBy :: (a -> a -> Boolean) -> Array a -> Array (Array a)');

  function productsOf3(x: number) {
    return function(y: number) {
      return x * y % 3 === 0;
    };
  }

  function zeroSum(x: number) {
    return function(y: number) {
      return x + y === 0;
    };
  }

  eq(S.groupBy(productsOf3)([]), []);
  eq(S.groupBy(productsOf3)([1, 2, 3, 4, 5, 6, 7, 8, 9]), [[1], [2, 3], [4], [5, 6], [7], [8, 9]]);
  eq(S.groupBy<number>(S.equals)([1, 1, 2, 1, 1]), [[1, 1], [2], [1, 1]]);
  eq(S.groupBy(zeroSum)([2, -3, 3, 3, 3, 4, -4, 4]), [[2], [-3, 3, 3, 3], [4, -4], [4]]);

  jsc.assert(jsc.forall('nat -> nat -> bool', 'array nat', function(f: (x: number) => (y: number) => boolean, xs: number[]) {
    return S.equals(S.join(S.groupBy(f)(xs)))(xs);
  }), {tests: 100});

});
