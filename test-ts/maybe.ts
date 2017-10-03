import * as S from '..';

import eq from './internal/eq';


test('maybe', () => {

  eq(typeof S.maybe, 'function');
  eq(S.maybe.length, 3);
  eq(S.maybe.toString(), 'maybe :: b -> (a -> b) -> Maybe a -> b');

  eq(S.maybe(0)(Math.sqrt)(S.Nothing), 0);
  eq(S.maybe(0)(Math.sqrt)(S.Just(9)), 3);

});
