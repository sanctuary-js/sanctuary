'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('tail', function() {

  it('is a unary function', function() {
    eq(typeof S.tail, 'function');
    eq(S.tail.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.tail({length: -1}); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'tail :: List a -> Maybe (List a)\n' +
                   '        ^^^^^^\n' +
                   '          1\n' +
                   '\n' +
                   '1)  {"length": -1} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘List a’.\n'));
  });

  it('returns a Nothing if applied to empty list', function() {
    eq(S.tail([]), S.Nothing());
  });

  it('returns Just the tail of a nonempty list', function() {
    eq(S.tail(['foo', 'bar', 'baz']), S.Just(['bar', 'baz']));
  });

});
