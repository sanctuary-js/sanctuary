'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('map', function() {

  it('is a binary function', function() {
    eq(typeof S.map, 'function');
    eq(S.map.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.map('xxx'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'map :: (Functor a, Functor b) => Function -> a -> b\n' +
                   '                                 ^^^^^^^^\n' +
                   '                                    1\n' +
                   '\n' +
                   '1)  "xxx" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.map(S.toUpper, 'xxx'); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'map :: (Functor a, Functor b) => Function -> a -> b\n' +
                   '        ^^^^^^^^^                            ^\n' +
                   '                                             1\n' +
                   '\n' +
                   '1)  "xxx" :: String\n' +
                   '\n' +
                   '‘map’ requires ‘a’ to satisfy the Functor type-class constraint; the value at position 1 does not.\n'));
  });

  it('maps a function into the context of Functors', function() {
    eq(S.map(S.not, S.odd)(2), true);
    eq(S.map(S.not, S.odd)(3), false);

    eq(S.map(S.mult(4), S.Just(2)), S.Just(8));
    eq(S.map(S.mult(4), S.Nothing()), S.Nothing());

    eq(S.map(S.mult(4), S.Left(3)), S.Left(3));
    eq(S.map(S.mult(4), S.Right(2)), S.Right(8));

    eq(S.map(S.mult(2), [1, 2, 3]), [2, 4, 6]);
    eq(S.map(S.mult(2), []), []);

    eq(S.map(S.mult(2), {a: 1, b: 2, c: 3}), {a: 2, b: 4, c: 6});
    eq(S.map(S.mult(2), {}), {});
  });

  it("does not map over an object's prototype properties", function() {
    var Point = function Point(x, y) {
      this.x = x;
      this.y = y;
    };

    Point.prototype.color = 'black';

    var point = new Point(0, 0);

    eq(S.map(S.inc, point), {x: 1, y: 1});
  });

});
