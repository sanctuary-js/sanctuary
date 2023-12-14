import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import toUpper from 'sanctuary/toUpper';


test ('toUpper', () => {

  eq (S.toUpper === toUpper, true);
  eq (String (S.toUpper), 'toUpper :: String -> String');

  eq (S.toUpper (''), '');
  eq (S.toUpper ('ABC def 123'), 'ABC DEF 123');

});
