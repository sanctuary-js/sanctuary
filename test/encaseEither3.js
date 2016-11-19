'use strict';

var throws = require('assert').throws;

var S = require('..');

var area = require('./internal/area');
var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('encaseEither3', function() {

  eq(typeof S.encaseEither3, 'function');
  eq(S.encaseEither3.length, 5);

  throws(function() { S.encaseEither3(null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'encaseEither3 :: Function -> Function -> a -> b -> c -> Either l r\n' +
                 '                 ^^^^^^^^\n' +
                 '                    1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  throws(function() { S.encaseEither3(S.I, null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'encaseEither3 :: Function -> Function -> a -> b -> c -> Either l r\n' +
                 '                             ^^^^^^^^\n' +
                 '                                1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  eq(S.encaseEither3(S.I, area, 3, 4, 5), S.Right(6));
  eq(S.encaseEither3(S.I, area, 2, 2, 5), S.Left(new Error('Impossible triangle')));
  eq(S.encaseEither3(S.prop('message'), area, 2, 2, 5), S.Left('Impossible triangle'));

});
