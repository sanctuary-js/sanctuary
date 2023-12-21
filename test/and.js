import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('and', () => {

  eq (String (S.and), 'and :: Boolean -> Boolean -> Boolean');

  eq (S.and (false) (false), false);
  eq (S.and (false) (true), false);
  eq (S.and (true) (false), false);
  eq (S.and (true) (true), true);

});
