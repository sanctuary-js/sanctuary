import * as S from '..';

import eq from './internal/eq';


test('tagBy', () => {

  eq(typeof S.tagBy, 'function');
  eq(S.tagBy.length, 2);
  eq(S.tagBy.toString(), 'tagBy :: (a -> Boolean) -> a -> Either a a');

  eq(S.tagBy(S.odd)(5), S.Right(5));
  eq(S.tagBy(S.odd)(6), S.Left(6));

});
