import {deepStrictEqual as eq} from 'node:assert';

import jsc from 'jsverify';
import test from 'oletus';
import Z from 'sanctuary-type-classes';

import * as S from 'sanctuary';
import groupBy from 'sanctuary/groupBy';


test ('groupBy', () => {

  eq (S.groupBy === groupBy, true);
  eq (String (S.groupBy), 'groupBy :: (a -> a -> Boolean) -> Array a -> Array (Array a)');

  eq (S.groupBy (x => y => x * y % 3 === 0) ([]), []);
  eq (S.groupBy (x => y => x * y % 3 === 0) ([1, 2, 3, 4, 5, 6, 7, 8, 9]), [[1], [2, 3], [4], [5, 6], [7], [8, 9]]);
  eq (S.groupBy (S.equals) ([1, 1, 2, 1, 1]), [[1, 1], [2], [1, 1]]);
  eq (S.groupBy (x => y => x + y === 0) ([2, -3, 3, 3, 3, 4, -4, 4]), [[2], [-3, 3, 3, 3], [4, -4], [4]]);

  jsc.assert (jsc.forall ('nat -> nat -> bool', 'array nat', (f, xs) => {
    const lhs = S.join (S.groupBy (f) (xs));
    const rhs = xs;
    return Z.equals (lhs, rhs);
  }), {tests: 1000});

});
