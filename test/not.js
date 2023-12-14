import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import not from 'sanctuary/not';


test ('not', () => {

  eq (S.not === not, true);
  eq (String (S.not), 'not :: Boolean -> Boolean');

  eq (S.not (false), true);
  eq (S.not (true), false);

});
