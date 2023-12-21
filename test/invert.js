import {deepStrictEqual as eq} from 'assert';

import S from './internal/sanctuary.js';

import {Sum} from './internal/Sum.mjs';


test ('invert', () => {

  eq (String (S.invert), 'invert :: Group g => g -> g');

  eq (S.invert (Sum (5)), Sum (-5));
  eq (S.invert (Sum (-5)), Sum (5));

});
