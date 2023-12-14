import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import or from 'sanctuary/or';


test ('or', () => {

  eq (S.or === or, true);
  eq (String (S.or), 'or :: Boolean -> Boolean -> Boolean');

  eq (S.or (false) (false), false);
  eq (S.or (false) (true), true);
  eq (S.or (true) (false), true);
  eq (S.or (true) (true), true);

});
