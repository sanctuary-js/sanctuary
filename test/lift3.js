'use strict';

var throws = require('assert').throws;

var S = require('..');

var area = require('./internal/area');
var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('lift3', function() {

  eq(typeof S.lift3, 'function');
  eq(S.lift3.length, 4);

  throws(function() { S.lift3('wrong'); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'lift3 :: (Apply a, Apply b, Apply c, Apply d) => Function -> a -> b -> c -> d\n' +
                 '                                                 ^^^^^^^^\n' +
                 '                                                    1\n' +
                 '\n' +
                 '1)  "wrong" :: String\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  eq(S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Just([1, 2, 3])), S.Just(6));
  eq(S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Nothing), S.Nothing);

  eq(S.lift3(S.reduce, S.Right(S.add), S.Right(0), S.Right([1, 2, 3])), S.Right(6));
  eq(S.lift3(S.reduce, S.Right(S.add), S.Right(0), S.Left('WHOOPS')), S.Left('WHOOPS'));

  eq(S.lift3(S.reduce, [S.add], [0], [[1, 2, 3]]), [6]);
  eq(S.lift3(S.reduce, [S.add], [0], []), []);

  eq(S.lift3(area, S.dec, S.I, S.inc)(4), 6);

});
