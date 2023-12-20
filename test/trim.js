'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('trim', () => {

  eq (String (S.trim), 'trim :: String -> String');

  eq (S.trim (''), '');
  eq (S.trim (' '), '');
  eq (S.trim ('x'), 'x');
  eq (S.trim (' x'), 'x');
  eq (S.trim ('x '), 'x');
  eq (S.trim (' x '), 'x');
  eq (S.trim ('\n\r\t x \n\r\t x \n\r\t'), 'x \n\r\t x');

});
