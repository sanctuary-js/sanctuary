import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import isLeft from 'sanctuary/isLeft';


test ('isLeft', () => {

  eq (S.isLeft === isLeft, true);
  eq (String (S.isLeft), 'isLeft :: Either a b -> Boolean');

  eq (S.isLeft (S.Left (42)), true);
  eq (S.isLeft (S.Right (42)), false);

});
