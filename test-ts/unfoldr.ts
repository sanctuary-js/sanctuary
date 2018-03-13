import * as S from '..';

import eq from './internal/eq';


test('unfoldr', () => {

  eq(typeof S.unfoldr, 'function');
  eq(S.unfoldr.length, 2);
  eq(S.unfoldr.toString(), 'unfoldr :: (b -> Maybe (Pair a b)) -> b -> Array a');

  function f(n: number) {
    return n >= 5 ? S.Nothing : S.Just([n, n + 1]);
  }
  eq(S.unfoldr(f)(5), []);
  eq(S.unfoldr(f)(4), [4]);
  eq(S.unfoldr(f)(1), [1, 2, 3, 4]);

});
