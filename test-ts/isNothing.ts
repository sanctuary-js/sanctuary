import * as S from '..';

import eq from './internal/eq';


test('isNothing', () => {

  eq(typeof S.isNothing, 'function');
  eq(S.isNothing.length, 1);
  eq(S.isNothing.toString(), 'isNothing :: Maybe a -> Boolean');

  eq(S.isNothing(S.Nothing), true);
  eq(S.isNothing(S.Just(42)), false);

});
