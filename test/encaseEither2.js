'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');
var rem = require('./internal/rem');


test('encaseEither2', function() {

  eq(typeof S.encaseEither2, 'function');
  eq(S.encaseEither2.length, 4);

  throws(function() { S.encaseEither2(null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'encaseEither2 :: Function -> Function -> a -> b -> Either l r\n' +
                 '                 ^^^^^^^^\n' +
                 '                    1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  throws(function() { S.encaseEither2(S.I, null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'encaseEither2 :: Function -> Function -> a -> b -> Either l r\n' +
                 '                             ^^^^^^^^\n' +
                 '                                1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  eq(S.encaseEither2(S.I, rem, 42, 5), S.Right(2));
  eq(S.encaseEither2(S.I, rem, 42, 0), S.Left(new Error('Cannot divide by zero')));
  eq(S.encaseEither2(S.prop('message'), rem, 42, 0), S.Left('Cannot divide by zero'));

});
