import * as S from '..';

import eq from './internal/eq';


test('isJust', () => {

  eq(typeof S.isJust, 'function');
  eq(S.isJust.length, 1);
  eq(S.isJust.toString(), 'isJust :: Maybe a -> Boolean');

  eq(S.isJust(S.Nothing), false);
  eq(S.isJust(S.Just(42)), true);

});
