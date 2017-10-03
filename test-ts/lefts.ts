import * as S from '..';

import eq from './internal/eq';


test('lefts', () => {

  eq(typeof S.lefts, 'function');
  eq(S.lefts.length, 1);
  eq(S.lefts.toString(), 'lefts :: Array (Either a b) -> Array a');

  eq(S.lefts([]), []);
  eq(S.lefts([S.Right(2), S.Right(1)]), []);
  eq(S.lefts([S.Right(2), S.Left('b')]), ['b']);
  eq(S.lefts([S.Left('a'), S.Right(1)]), ['a']);
  eq(S.lefts([S.Left('a'), S.Left('b')]), ['a', 'b']);

});
