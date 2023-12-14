import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import isNothing from 'sanctuary/isNothing';


test ('isNothing', () => {

  eq (S.isNothing === isNothing, true);
  eq (String (S.isNothing), 'isNothing :: Maybe a -> Boolean');

  eq (S.isNothing (S.Nothing), true);
  eq (S.isNothing (S.Just (42)), false);

});
