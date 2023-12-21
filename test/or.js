import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('or', () => {

  eq (String (S.or), 'or :: Boolean -> Boolean -> Boolean');

  eq (S.or (false) (false), false);
  eq (S.or (false) (true), true);
  eq (S.or (true) (false), true);
  eq (S.or (true) (true), true);

});
