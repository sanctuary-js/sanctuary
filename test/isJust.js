import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import isJust from 'sanctuary/isJust';


test ('isJust', () => {

  eq (S.isJust === isJust, true);
  eq (String (S.isJust), 'isJust :: Maybe a -> Boolean');

  eq (S.isJust (S.Nothing), false);
  eq (S.isJust (S.Just (42)), true);

});
