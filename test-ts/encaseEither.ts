import * as S from '..';

import eq from './internal/eq';
import factorial from './internal/factorial';


test('encaseEither', () => {

  eq(typeof S.encaseEither, 'function');
  eq(S.encaseEither.length, 3);
  eq(S.encaseEither.toString(), 'encaseEither :: (Error -> l) -> (a -> r) -> a -> Either l r');

  eq(S.encaseEither(S.I)(factorial)(5), S.Right(120));
  eq(S.encaseEither(S.I)(factorial)(-1), S.Left(new Error('Cannot determine factorial of negative number')));
  eq(S.encaseEither(S.prop('message'))(factorial)(-1), S.Left('Cannot determine factorial of negative number'));

});
