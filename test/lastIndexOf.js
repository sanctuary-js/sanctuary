'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('lastIndexOf', function() {

  eq(typeof S.lastIndexOf, 'function');
  eq(S.lastIndexOf.length, 2);

  throws(function() { S.lastIndexOf('x', null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'lastIndexOf :: a -> List a -> Maybe Integer\n' +
                 '                    ^^^^^^\n' +
                 '                      1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘List a’.\n'));

  eq(S.lastIndexOf('x', []), S.Nothing);
  eq(S.lastIndexOf('x', ['b', 'a', 'n', 'a', 'n', 'a']), S.Nothing);
  eq(S.lastIndexOf('a', ['b', 'a', 'n', 'a', 'n', 'a']), S.Just(5));

  eq(S.lastIndexOf('ax', ''), S.Nothing);
  eq(S.lastIndexOf('ax', 'banana'), S.Nothing);
  eq(S.lastIndexOf('an', 'banana'), S.Just(3));

});
