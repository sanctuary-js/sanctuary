import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import reduce from 'sanctuary/reduce';


test ('reduce', () => {

  eq (S.reduce === reduce, true);
  eq (String (S.reduce), 'reduce :: Foldable f => (b -> a -> b) -> b -> f a -> b');

  eq (S.reduce (S.concat) ('x') ([]), 'x');
  eq (S.reduce (S.concat) ('x') (['A', 'B', 'C']), 'xABC');
  eq (S.reduce (S.concat) ('x') ({}), 'x');
  eq (S.reduce (S.concat) ('x') ({a: 'A', b: 'B', c: 'C'}), 'xABC');
  eq (S.reduce (S.concat) ('x') ({c: 'C', b: 'B', a: 'A'}), 'xABC');
  eq (S.reduce (S.concat) ('x') (S.Just ('A')), 'xA');
  eq (S.reduce (S.lift2 (S.concat)) (S.Just ('x')) ([S.Just ('A'), S.Just ('B'), S.Just ('C')]), S.Just ('xABC'));

});
