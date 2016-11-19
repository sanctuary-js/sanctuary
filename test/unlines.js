'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('unlines', function() {

  eq(typeof S.unlines, 'function');
  eq(S.unlines.length, 1);

  throws(function() { S.unlines(null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'unlines :: Array String -> String\n' +
                 '           ^^^^^^^^^^^^\n' +
                 '                1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Array String’.\n'));

  eq(S.unlines([]), '');
  eq(S.unlines(['']), '\n');
  eq(S.unlines(['', '']), '\n\n');
  eq(S.unlines(['\n']), '\n\n');
  eq(S.unlines(['\n', '\n']), '\n\n\n\n');
  eq(S.unlines(['foo', 'bar', 'baz']), 'foo\nbar\nbaz\n');

});
