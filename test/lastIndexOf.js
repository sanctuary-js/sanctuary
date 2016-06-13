'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('lastIndexOf', function() {

  eq(typeof S.lastIndexOf, 'function');
  eq(S.lastIndexOf.length, 2);
  eq(S.lastIndexOf.toString(), 'lastIndexOf :: a -> List a -> Maybe Integer');

  eq(S.lastIndexOf('x', []), S.Nothing);
  eq(S.lastIndexOf('x', ['b', 'a', 'n', 'a', 'n', 'a']), S.Nothing);
  eq(S.lastIndexOf('a', ['b', 'a', 'n', 'a', 'n', 'a']), S.Just(5));

  eq(S.lastIndexOf('ax', ''), S.Nothing);
  eq(S.lastIndexOf('ax', 'banana'), S.Nothing);
  eq(S.lastIndexOf('an', 'banana'), S.Just(3));

});
