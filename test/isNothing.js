import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('isNothing', () => {

  eq (String (S.isNothing), 'isNothing :: Maybe a -> Boolean');

  eq (S.isNothing (S.Nothing), true);
  eq (S.isNothing (S.Just (42)), false);

});
