import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('isRight', () => {

  eq (String (S.isRight), 'isRight :: Either a b -> Boolean');

  eq (S.isRight (S.Left (42)), false);
  eq (S.isRight (S.Right (42)), true);

});
