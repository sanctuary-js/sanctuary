import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import fromLeft from 'sanctuary/fromLeft';


test ('fromLeft', () => {

  eq (S.fromLeft === fromLeft, true);
  eq (String (S.fromLeft), 'fromLeft :: a -> Either a b -> a');

  eq (S.fromLeft ('abc') (S.Left ('xyz')), 'xyz');
  eq (S.fromLeft ('abc') (S.Right (123)), 'abc');

});
