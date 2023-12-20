'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('words', () => {

  eq (String (S.words), 'words :: String -> Array String');

  eq (S.words (''), []);
  eq (S.words (' '), []);
  eq (S.words (' \t\r\n'), []);
  eq (S.words ('foo bar baz'), ['foo', 'bar', 'baz']);
  eq (S.words (' foo bar baz '), ['foo', 'bar', 'baz']);
  eq (S.words ('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['foo', 'bar', 'baz']);

});
