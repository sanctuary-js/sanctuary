'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('trim', function() {

  eq (typeof S.trim) ('function');
  eq (S.trim.length) (1);
  eq (String (S.trim)) ('trim :: String -> String');

  eq (S.trim ('')) ('');
  eq (S.trim (' ')) ('');
  eq (S.trim ('x')) ('x');
  eq (S.trim (' x')) ('x');
  eq (S.trim ('x ')) ('x');
  eq (S.trim (' x ')) ('x');
  eq (S.trim ('\n\r\t x \n\r\t x \n\r\t')) ('x \n\r\t x');

});
