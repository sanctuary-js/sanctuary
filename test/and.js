import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import and from 'sanctuary/and';


test ('and', () => {

  eq (S.and === and, true);
  eq (String (S.and), 'and :: Boolean -> Boolean -> Boolean');

  eq (S.and (false) (false), false);
  eq (S.and (false) (true), false);
  eq (S.and (true) (false), false);
  eq (S.and (true) (true), true);

});
