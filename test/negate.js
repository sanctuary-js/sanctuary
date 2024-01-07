import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('negate', () => {

  eq (String (S.negate), 'negate :: ValidNumber -> ValidNumber');

  eq (S.negate (0.5), -0.5);
  eq (S.negate (-0.5), 0.5);

});
