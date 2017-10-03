import * as S from '..';

import eq from './internal/eq';
import rem from './internal/rem';


test('encaseEither2', () => {

  eq(typeof S.encaseEither2, 'function');
  eq(S.encaseEither2.length, 4);
  eq(S.encaseEither2.toString(), 'encaseEither2 :: (Error -> l) -> (a -> b -> r) -> a -> b -> Either l r');

  eq(S.encaseEither2(S.I)(rem)(42)(5), S.Right(2));
  eq(S.encaseEither2(S.I)(rem)(42)(0), S.Left(new Error('Cannot divide by zero')));
  eq(S.encaseEither2(S.prop('message'))(rem)(42)(0), S.Left('Cannot divide by zero'));

});
