import * as S from '..';

import eq from './internal/eq';


test('maybeToEither', () => {

  eq(typeof S.maybeToEither, 'function');
  eq(S.maybeToEither.length, 2);
  eq(S.maybeToEither.toString(), 'maybeToEither :: a -> Maybe b -> Either a b');

  eq(S.maybeToEither('error msg')(S.Nothing), S.Left('error msg'));
  eq(S.maybeToEither('error msg')(S.Just(42)), S.Right(42));

});
