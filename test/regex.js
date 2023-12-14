import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import regex from 'sanctuary/regex';


test ('regex', () => {

  eq (S.regex === regex, true);
  eq (String (S.regex), 'regex :: RegexFlags -> String -> RegExp');

  eq (S.regex ('') ('\\d'), /\d/);
  eq (S.regex ('g') ('\\d'), /\d/g);
  eq (S.regex ('i') ('\\d'), /\d/i);
  eq (S.regex ('m') ('\\d'), /\d/m);
  eq (S.regex ('gi') ('\\d'), /\d/gi);
  eq (S.regex ('gm') ('\\d'), /\d/gm);
  eq (S.regex ('im') ('\\d'), /\d/im);
  eq (S.regex ('gim') ('\\d'), /\d/gim);

});
