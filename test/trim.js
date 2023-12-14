import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import trim from 'sanctuary/trim';


test ('trim', () => {

  eq (S.trim === trim, true);
  eq (String (S.trim), 'trim :: String -> String');

  eq (S.trim (''), '');
  eq (S.trim (' '), '');
  eq (S.trim ('x'), 'x');
  eq (S.trim (' x'), 'x');
  eq (S.trim ('x '), 'x');
  eq (S.trim (' x '), 'x');
  eq (S.trim ('\n\r\t x \n\r\t x \n\r\t'), 'x \n\r\t x');

});
