import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import zero from 'sanctuary/zero';


test ('zero', () => {

  eq (S.zero === zero, true);
  eq (String (S.zero), 'zero :: Plus f => TypeRep (f a) -> f a');

  eq (S.zero (Array), []);
  eq (S.zero (Object), {});
  eq (S.zero (S.Maybe), S.Nothing);

});
