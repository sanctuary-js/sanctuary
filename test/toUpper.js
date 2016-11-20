'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('toUpper', function() {

  eq(typeof S.toUpper, 'function');
  eq(S.toUpper.length, 1);

  throws(function() { S.toUpper(true); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'toUpper :: String -> String\n' +
         '           ^^^^^^\n' +
         '             1\n' +
         '\n' +
         '1)  true :: Boolean\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  eq(S.toUpper(''), '');
  eq(S.toUpper('ABC def 123'), 'ABC DEF 123');
  eq(S.toUpper(new String('')), '');
  eq(S.toUpper(new String('ABC def 123')), 'ABC DEF 123');

});
