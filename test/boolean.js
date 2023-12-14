import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import boolean from 'sanctuary/boolean';


test ('boolean', () => {

  eq (S.boolean === boolean, true);
  eq (String (S.boolean), 'boolean :: a -> a -> Boolean -> a');

  eq (S.boolean ('no') ('yes') (false), 'no');
  eq (S.boolean ('no') ('yes') (true), 'yes');

});
