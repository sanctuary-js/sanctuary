'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('pluck', function() {

  eq(typeof S.pluck, 'function');
  eq(S.pluck.length, 2);
  eq(S.pluck.toString(), 'pluck :: (Accessible a, Functor f) => String -> f a -> f b');

  throws(function() { S.pluck('a', [{a: 1}, {b: 2}]); },
         TypeError,
         '‘pluck’ expected object to have a property named ‘a’; {"b": 2} does not');

  eq(S.pluck('x', []), []);
  eq(S.pluck('x', [{x: 1}, {x: 2}, {x: 3}]), [1, 2, 3]);

  eq(S.pluck('x', S.Nothing), S.Nothing);
  eq(S.pluck('x', S.Just({x: 1, y: 2, z: 3})), S.Just(1));

});
