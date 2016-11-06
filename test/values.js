'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('values', function() {

  it('is a unary function', function() {
    eq(typeof S.values, 'function');
    eq(S.values.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.values('xxx'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'values :: StrMap a -> Array a\n' +
                   '          ^^^^^^^^\n' +
                   '             1\n' +
                   '\n' +
                   '1)  "xxx" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘StrMap a’.\n'));

    throws(function() { S.values({a: '1', b: 2, c: '3'}); },
           errorEq(TypeError,
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
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));
  });

  it("returns an array of the given object's own values", function() {
    eq(S.values({}), []);
    eq(S.values({a: 1, b: 2, c: 3}).sort(), [1, 2, 3]);
  });

  it('does not include prototype values', function() {
    var proto = {a: 1, b: 2};
    var obj = Object.create(proto);
    obj.c = 3;
    obj.d = 4;

    eq(S.values(obj).sort(), [3, 4]);
  });

});
