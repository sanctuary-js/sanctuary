import * as S from '..';

import eq from './internal/eq';


test('fromMaybe', () => {

  eq(typeof S.fromMaybe, 'function');
  eq(S.fromMaybe.length, 2);
  eq(S.fromMaybe.toString(), 'fromMaybe :: a -> Maybe a -> a');

  eq(S.fromMaybe(0)(S.Nothing), 0);
  eq(S.fromMaybe(0)(S.Just(42)), 42);

});
