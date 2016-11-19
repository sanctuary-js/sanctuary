'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('toLower', function() {

  eq(typeof S.toLower, 'function');
  eq(S.toLower.length, 1);

  throws(function() { S.toLower(true); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'toLower :: String -> String\n' +
                 '           ^^^^^^\n' +
                 '             1\n' +
                 '\n' +
                 '1)  true :: Boolean\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘String’.\n'));

  eq(S.toLower(''), '');
  eq(S.toLower('ABC def 123'), 'abc def 123');
  eq(S.toLower(new String('')), '');
  eq(S.toLower(new String('ABC def 123')), 'abc def 123');

});
