import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('unlines', () => {

  eq (String (S.unlines), 'unlines :: Array String -> String');

  eq (S.unlines ([]), '');
  eq (S.unlines (['']), '\n');
  eq (S.unlines (['', '']), '\n\n');
  eq (S.unlines (['\n']), '\n\n');
  eq (S.unlines (['\n', '\n']), '\n\n\n\n');
  eq (S.unlines (['foo', 'bar', 'baz']), 'foo\nbar\nbaz\n');

});
