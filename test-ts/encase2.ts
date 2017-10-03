import * as S from '..';

import eq from './internal/eq';
import rem from './internal/rem';


test('encase2', () => {

  eq(typeof S.encase2, 'function');
  eq(S.encase2.length, 3);
  eq(S.encase2.toString(), 'encase2 :: (a -> b -> c) -> a -> b -> Maybe c');

  eq(S.encase2(rem)(42)(5), S.Just(2));
  eq(S.encase2(rem)(42)(0), S.Nothing);

});
