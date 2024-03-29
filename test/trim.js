import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


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
