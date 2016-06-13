'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('indexOf', function() {

  eq(typeof S.indexOf, 'function');
  eq(S.indexOf.length, 2);
  eq(S.indexOf.toString(), 'indexOf :: a -> List a -> Maybe Integer');

  eq(S.indexOf('x', []), S.Nothing);
  eq(S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a']), S.Nothing);
  eq(S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a']), S.Just(1));

  eq(S.indexOf('ax', ''), S.Nothing);
  eq(S.indexOf('ax', 'banana'), S.Nothing);
  eq(S.indexOf('an', 'banana'), S.Just(1));

});
