'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('maybeToNullable', function() {

  eq(typeof S.maybeToNullable, 'function');
  eq(S.maybeToNullable.length, 1);

  throws(function() { S.maybeToNullable(/XXX/); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'maybeToNullable :: Maybe a -> Nullable a\n' +
                 '                   ^^^^^^^\n' +
                 '                      1\n' +
                 '\n' +
                 '1)  /XXX/ :: RegExp\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Maybe a’.\n'));

  eq(S.maybeToNullable(S.Nothing), null);
  eq(S.maybeToNullable(S.Just(42)), 42);

});
