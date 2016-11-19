'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('unfoldr', function() {

  eq(typeof S.unfoldr, 'function');
  eq(S.unfoldr.length, 2);

  throws(function() { S.unfoldr(null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'unfoldr :: Function -> b -> Array a\n' +
                 '           ^^^^^^^^\n' +
                 '              1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  var f = function(n) {
    return n >= 5 ? S.Nothing : S.Just([n, n + 1]);
  };
  eq(S.unfoldr(f, 5), []);
  eq(S.unfoldr(f, 4), [4]);
  eq(S.unfoldr(f, 1), [1, 2, 3, 4]);

});
