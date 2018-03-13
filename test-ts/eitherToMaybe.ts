import * as S from '..';

import eq from './internal/eq';


test('eitherToMaybe', () => {

  eq(typeof S.eitherToMaybe, 'function');
  eq(S.eitherToMaybe.length, 1);
  eq(S.eitherToMaybe.toString(), 'eitherToMaybe :: Either a b -> Maybe b');

  eq(S.eitherToMaybe(S.Left('Cannot divide by zero')), S.Nothing);
  eq(S.eitherToMaybe(S.Right(42)), S.Just(42));

});
