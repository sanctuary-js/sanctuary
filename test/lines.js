'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('lines', function() {

  eq(typeof S.lines, 'function');
  eq(S.lines.length, 1);

  throws(function() { S.lines(['foo']); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'lines :: String -> Array String\n' +
         '         ^^^^^^\n' +
         '           1\n' +
         '\n' +
         '1)  ["foo"] :: Array String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  eq(S.lines(''), []);
  eq(S.lines('\n'), ['']);
  eq(S.lines('\n\n'), ['', '']);
  eq(S.lines('foo\nbar\nbaz'), ['foo', 'bar', 'baz']);
  eq(S.lines('foo\nbar\nbaz\n'), ['foo', 'bar', 'baz']);
  eq(S.lines('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['\tfoo', '\tbar', '\tbaz']);

});
