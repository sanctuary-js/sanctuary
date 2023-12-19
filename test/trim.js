'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('trim', () => {

  eq (String (S.trim)) ('trim :: String -> String');

  eq (S.trim ('')) ('');
  eq (S.trim (' ')) ('');
  eq (S.trim ('x')) ('x');
  eq (S.trim (' x')) ('x');
  eq (S.trim ('x ')) ('x');
  eq (S.trim (' x ')) ('x');
  eq (S.trim ('\n\r\t x \n\r\t x \n\r\t')) ('x \n\r\t x');

});
