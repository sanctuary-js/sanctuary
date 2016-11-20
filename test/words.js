'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('words', function() {

  eq(typeof S.words, 'function');
  eq(S.words.length, 1);

  throws(function() { S.words(['foo']); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'words :: String -> Array String\n' +
         '         ^^^^^^\n' +
         '           1\n' +
         '\n' +
         '1)  ["foo"] :: Array String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  eq(S.words(''), []);
  eq(S.words(' '), []);
  eq(S.words(' \t\r\n'), []);
  eq(S.words('foo bar baz'), ['foo', 'bar', 'baz']);
  eq(S.words(' foo bar baz '), ['foo', 'bar', 'baz']);
  eq(S.words('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['foo', 'bar', 'baz']);

});
