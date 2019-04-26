'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('toUpper', () => {

  eq (S.show (S.toUpper)) ('toUpper :: String -> String');

  eq (S.toUpper ('')) ('');
  eq (S.toUpper ('ABC def 123')) ('ABC DEF 123');

});
