import * as S from '..';

import eq from './internal/eq';


test('mapMaybe', () => {

  eq(typeof S.mapMaybe, 'function');
  eq(S.mapMaybe.length, 2);
  eq(S.mapMaybe.toString(), 'mapMaybe :: (a -> Maybe b) -> Array a -> Array b');

  eq(S.mapMaybe(S.head)([]), []);
  eq(S.mapMaybe(S.head)([[], [], []]), []);
  eq(S.mapMaybe(S.head)([[1, 2], [3, 4], [5, 6]]), [1, 3, 5]);
  eq(S.mapMaybe(S.head)([[1], [], [3], [], [5], []]), [1, 3, 5]);

});
