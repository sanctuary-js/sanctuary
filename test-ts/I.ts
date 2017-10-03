import * as S from '..';

import eq from './internal/eq';


test('I', () => {

  eq(typeof S.I, 'function');
  eq(S.I.length, 1);
  eq(S.I.toString(), 'I :: a -> a');

  eq(S.I([1, 2, 3]), [1, 2, 3]);
  eq(S.I(['foo', 42]), ['foo', 42]);

});
