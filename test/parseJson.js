'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('parseJson', function() {

  eq(typeof S.parseJson, 'function');
  eq(S.parseJson.length, 2);

  throws(function() { S.parseJson('String'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'parseJson :: TypeRep -> String -> Maybe a\n' +
         '             ^^^^^^^\n' +
         '                1\n' +
         '\n' +
         '1)  "String" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘TypeRep’.\n');

  throws(function() { S.parseJson(Array, [1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'parseJson :: TypeRep -> String -> Maybe a\n' +
         '                        ^^^^^^\n' +
         '                          1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  eq(S.parseJson(Object, '[Invalid JSON]'), S.Nothing);
  eq(S.parseJson(Array, '{"foo":"bar"}'), S.Nothing);
  eq(S.parseJson(Array, '["foo","bar"]'), S.Just(['foo', 'bar']));

});
