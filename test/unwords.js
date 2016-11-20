'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('unwords', function() {

  eq(typeof S.unwords, 'function');
  eq(S.unwords.length, 1);

  throws(function() { S.unwords(null); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'unwords :: Array String -> String\n' +
         '           ^^^^^^^^^^^^\n' +
         '                1\n' +
         '\n' +
         '1)  null :: Null\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Array String’.\n');

  eq(S.unwords([]), '');
  eq(S.unwords(['']), '');
  eq(S.unwords(['', '']), ' ');
  eq(S.unwords([' ']), ' ');
  eq(S.unwords([' ', ' ']), '   ');
  eq(S.unwords(['foo', 'bar', 'baz']), 'foo bar baz');
  eq(S.unwords([' foo ', ' bar ', ' baz ']), ' foo   bar   baz ');

});
