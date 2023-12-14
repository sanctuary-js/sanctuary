import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import isRight from 'sanctuary/isRight';


test ('isRight', () => {

  eq (S.isRight === isRight, true);
  eq (String (S.isRight), 'isRight :: Either a b -> Boolean');

  eq (S.isRight (S.Left (42)), false);
  eq (S.isRight (S.Right (42)), true);

});
