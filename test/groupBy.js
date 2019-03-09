'use strict';

const jsc = require ('jsverify');

const S = require ('..');

const eq = require ('./internal/eq');
const equals = require ('./internal/equals');


test ('groupBy', () => {

  eq (typeof S.groupBy) ('function');
  eq (S.groupBy.length) (1);
  eq (S.show (S.groupBy)) ('groupBy :: (a -> a -> Boolean) -> Array a -> Array (Array a)');

  eq (S.groupBy (x => y => x * y % 3 === 0) ([])) ([]);
  eq (S.groupBy (x => y => x * y % 3 === 0) ([1, 2, 3, 4, 5, 6, 7, 8, 9])) ([[1], [2, 3], [4], [5, 6], [7], [8, 9]]);
  eq (S.groupBy (equals) ([1, 1, 2, 1, 1])) ([[1, 1], [2], [1, 1]]);
  eq (S.groupBy (x => y => x + y === 0) ([2, -3, 3, 3, 3, 4, -4, 4])) ([[2], [-3, 3, 3, 3], [4, -4], [4]]);

  jsc.assert (jsc.forall ('nat -> nat -> bool', 'array nat', (f, xs) => {
    const lhs = S.join (S.groupBy (f) (xs));
    const rhs = xs;
    return equals (lhs) (rhs);
  }), {tests: 1000});

});
