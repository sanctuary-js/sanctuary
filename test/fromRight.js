import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import fromRight from 'sanctuary/fromRight';


test ('fromRight', () => {

  eq (S.fromRight === fromRight, true);
  eq (String (S.fromRight), 'fromRight :: b -> Either a b -> b');

  eq (S.fromRight (123) (S.Right (789)), 789);
  eq (S.fromRight (123) (S.Left ('abc')), 123);

});
