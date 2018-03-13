import * as S from '..';

import eq from './internal/eq';


test('K', () => {

  eq(typeof S.K, 'function');
  eq(S.K.length, 2);
  eq(S.K.toString(), 'K :: a -> b -> a');

  eq(S.K(21)([]), 21);
  eq(S.K(42)(null), 42);
  eq(S.K(84)(undefined), 84);

});
