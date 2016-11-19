'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('keys', function() {

  eq(typeof S.keys, 'function');
  eq(S.keys.length, 1);

  throws(function() { S.keys('xxx'); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'keys :: StrMap a -> Array String\n' +
                 '        ^^^^^^^^\n' +
                 '           1\n' +
                 '\n' +
                 '1)  "xxx" :: String\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘StrMap a’.\n'));

  throws(function() { S.keys({a: '1', b: 2, c: '3'}); },
         errorEq(TypeError,
                 'Type-variable constraint violation\n' +
                 '\n' +
                 'keys :: StrMap a -> Array String\n' +
                 '               ^\n' +
                 '               1\n' +
                 '\n' +
                 '1)  "1" :: String\n' +
                 '    2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                 '    "3" :: String\n' +
                 '\n' +
                 'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));

  eq(S.keys({}), []);
  eq(S.keys({a: 1, b: 2, c: 3}).sort(), ['a', 'b', 'c']);

  var proto = {a: 1, b: 2};
  var obj = Object.create(proto);
  obj.c = 3;
  obj.d = 4;

  eq(S.keys(obj).sort(), ['c', 'd']);

});
