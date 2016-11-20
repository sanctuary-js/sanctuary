'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('eitherToMaybe', function() {

  eq(typeof S.eitherToMaybe, 'function');
  eq(S.eitherToMaybe.length, 1);

  throws(function() { S.eitherToMaybe(/XXX/); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'eitherToMaybe :: Either a b -> Maybe b\n' +
         '                 ^^^^^^^^^^\n' +
         '                     1\n' +
         '\n' +
         '1)  /XXX/ :: RegExp\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Either a b’.\n');

  eq(S.eitherToMaybe(S.Left('Cannot divide by zero')), S.Nothing);
  eq(S.eitherToMaybe(S.Right(42)), S.Just(42));

});
