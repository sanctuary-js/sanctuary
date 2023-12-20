'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('toUpper', () => {

  eq (String (S.toUpper), 'toUpper :: String -> String');

  eq (S.toUpper (''), '');
  eq (S.toUpper ('ABC def 123'), 'ABC DEF 123');

});
