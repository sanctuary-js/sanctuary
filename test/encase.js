import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';

import area from './internal/area.js';
import factorial from './internal/factorial.js';
import rem from './internal/rem.js';


test ('encase', () => {

  eq (String (S.encase), 'encase :: (Throwing e a b) -> a -> Either e b');

  //    safeFactorial :: Number -> Maybe Number
  const safeFactorial = S.encase (factorial);

  eq (safeFactorial (5), S.Right (120));
  eq (safeFactorial (-1), S.Left ('Cannot determine factorial of negative number'));

  //    safeRem :: Number -> Number -> Maybe Number
  const safeRem = S.compose (S.encase) (rem);

  eq (safeRem (42) (5), S.Right (2));
  eq (safeRem (42) (0), S.Left (new Error ('Cannot divide by zero')));

  //    safeArea :: Number -> Number -> Number -> Maybe Number
  const safeArea = S.compose (S.compose (S.encase)) (area);

  eq (safeArea (3) (4) (5), S.Right (6));
  eq (safeArea (2) (2) (5), S.Left (new Error ('Impossible triangle')));

});
