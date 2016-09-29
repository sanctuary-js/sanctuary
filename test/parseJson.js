'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('parseJson', function() {

  it('is a binary function', function() {
    eq(typeof S.parseJson, 'function');
    eq(S.parseJson.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.parseJson('String'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'parseJson :: TypeRep -> String -> Maybe a\n' +
                   '             ^^^^^^^\n' +
                   '                1\n' +
                   '\n' +
                   '1)  "String" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘TypeRep’.\n'));

    throws(function() { S.parseJson(Array, [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'parseJson :: TypeRep -> String -> Maybe a\n' +
                   '                        ^^^^^^\n' +
                   '                          1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('returns a Just when applied to a valid JSON string', function() {
    eq(S.parseJson(Array, '["foo","bar"]'), S.Just(['foo', 'bar']));
  });

  it('returns Nothing when applied to an invalid JSON string', function() {
    eq(S.parseJson(Object, '[Invalid JSON]'), S.Nothing);
  });

  it('returns Nothing when the parsed result is not a member of the given type', function() {
    eq(S.parseJson(Array, '{"foo":"bar"}'), S.Nothing);
  });

});
