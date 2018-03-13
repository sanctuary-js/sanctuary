import * as S from '..';

import eq from './internal/eq';


test('empty', () => {

  eq(typeof S.empty, 'function');
  eq(S.empty.length, 1);
  eq(S.empty.toString(), 'empty :: Monoid a => TypeRep a -> a');

  eq(S.empty(String), '');
  eq(S.empty(Array), []);
  eq(S.empty(Object), {});

});
