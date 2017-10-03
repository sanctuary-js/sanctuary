import * as S from '..';

import area from './internal/area';
import eq from './internal/eq';


test('encase3', () => {

  eq(typeof S.encase3, 'function');
  eq(S.encase3.length, 4);
  eq(S.encase3.toString(), 'encase3 :: (a -> b -> c -> d) -> a -> b -> c -> Maybe d');

  eq(S.encase3(area)(3)(4)(5), S.Just(6));
  eq(S.encase3(area)(2)(2)(5), S.Nothing);

});
