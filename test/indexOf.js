'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('indexOf', function() {

  eq(typeof S.indexOf, 'function');
  eq(S.indexOf.length, 2);

  throws(function() { S.indexOf('x', null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'indexOf :: a -> List a -> Maybe Integer\n' +
                 '                ^^^^^^\n' +
                 '                  1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘List a’.\n'));

  eq(S.indexOf('x', []), S.Nothing);
  eq(S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a']), S.Nothing);
  eq(S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a']), S.Just(1));

  eq(S.indexOf('ax', ''), S.Nothing);
  eq(S.indexOf('ax', 'banana'), S.Nothing);
  eq(S.indexOf('an', 'banana'), S.Just(1));

});
