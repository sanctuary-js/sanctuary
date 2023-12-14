import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import negate from 'sanctuary/negate';


test ('negate', () => {

  eq (S.negate === negate, true);
  eq (String (S.negate), 'negate :: ValidNumber -> ValidNumber');

  eq (S.negate (0.5), -0.5);
  eq (S.negate (-0.5), 0.5);

});
