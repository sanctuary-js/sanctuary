import * as S from '..';

import eq from './internal/eq';


test('pairs', () => {

  function comparePairsAsc<A, B>(a: [A, B], b: [A, B]) {
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
  }

  eq(typeof S.pairs, 'function');
  eq(S.pairs.length, 1);
  eq(S.pairs.toString(), 'pairs :: StrMap a -> Array (Pair String a)');

  eq(S.pairs({}), []);
  eq(S.pairs({a: 1, b: 2, c: 3}).sort(comparePairsAsc), [['a', 1], ['b', 2], ['c', 3]]);

  const proto = {a: 1, b: 2};
  const obj = Object.create(proto);
  obj.c = 3;
  obj.d = 4;

  eq(S.pairs(obj).sort(comparePairsAsc), [['c', 3], ['d', 4]]);

});
