import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import invert from 'sanctuary/invert';

import {Sum} from './internal/Sum.js';


test ('invert', () => {

  eq (S.invert === invert, true);
  eq (String (S.invert), 'invert :: Group g => g -> g');

  eq (S.invert (Sum (5)), Sum (-5));
  eq (S.invert (Sum (-5)), Sum (5));

});
