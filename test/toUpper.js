import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('toUpper', () => {

  eq (String (S.toUpper), 'toUpper :: String -> String');

  eq (S.toUpper (''), '');
  eq (S.toUpper ('ABC def 123'), 'ABC DEF 123');

});
