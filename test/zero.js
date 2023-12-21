import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('zero', () => {

  eq (String (S.zero), 'zero :: Plus f => TypeRep (f a) -> f a');

  eq (S.zero (Array), []);
  eq (S.zero (Object), {});
  eq (S.zero (S.Maybe), S.Nothing);

});
