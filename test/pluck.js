'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('pluck', function() {

  eq(typeof S.pluck, 'function');
  eq(S.pluck.length, 2);
  eq(S.pluck.toString(), 'pluck :: Accessible a => String -> Array a -> Array b');

  throws(function() { S.pluck('a', [{a: 1}, {b: 2}]); },
         TypeError,
         '‘pluck’ expected object at index 1 to have a property named ‘a’; {"b": 2} does not');

  eq(S.pluck('x', []), []);
  eq(S.pluck('x', [{x: 1}, {x: 2}, {x: 3}]), [1, 2, 3]);

});
