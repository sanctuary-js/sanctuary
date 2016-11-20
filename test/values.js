'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('values', function() {

  eq(typeof S.values, 'function');
  eq(S.values.length, 1);

  throws(function() { S.values('xxx'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'values :: StrMap a -> Array a\n' +
         '          ^^^^^^^^\n' +
         '             1\n' +
         '\n' +
         '1)  "xxx" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘StrMap a’.\n');

  throws(function() { S.values({a: '1', b: 2, c: '3'}); },
         TypeError,
         'Type-variable constraint violation\n' +
         '\n' +
         'values :: StrMap a -> Array a\n' +
         '                 ^\n' +
         '                 1\n' +
         '\n' +
         '1)  "1" :: String\n' +
         '    2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
         '    "3" :: String\n' +
         '\n' +
         'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n');

  eq(S.values({}), []);
  eq(S.values({a: 1, b: 2, c: 3}).sort(), [1, 2, 3]);

  var proto = {a: 1, b: 2};
  var obj = Object.create(proto);
  obj.c = 3;
  obj.d = 4;

  eq(S.values(obj).sort(), [3, 4]);

});
