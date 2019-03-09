'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('unlines', () => {

  eq (typeof S.unlines) ('function');
  eq (S.unlines.length) (1);
  eq (S.show (S.unlines)) ('unlines :: Array String -> String');

  eq (S.unlines ([])) ('');
  eq (S.unlines ([''])) ('\n');
  eq (S.unlines (['', ''])) ('\n\n');
  eq (S.unlines (['\n'])) ('\n\n');
  eq (S.unlines (['\n', '\n'])) ('\n\n\n\n');
  eq (S.unlines (['foo', 'bar', 'baz'])) ('foo\nbar\nbaz\n');

});
