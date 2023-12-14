import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import words from 'sanctuary/words';


test ('words', () => {

  eq (S.words === words, true);
  eq (String (S.words), 'words :: String -> Array String');

  eq (S.words (''), []);
  eq (S.words (' '), []);
  eq (S.words (' \t\r\n'), []);
  eq (S.words ('foo bar baz'), ['foo', 'bar', 'baz']);
  eq (S.words (' foo bar baz '), ['foo', 'bar', 'baz']);
  eq (S.words ('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['foo', 'bar', 'baz']);

});
