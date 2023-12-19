'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('toUpper', () => {

  eq (String (S.toUpper)) ('toUpper :: String -> String');

  eq (S.toUpper ('')) ('');
  eq (S.toUpper ('ABC def 123')) ('ABC DEF 123');

});
