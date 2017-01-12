'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('tail', function() {

  eq(typeof S.tail, 'function');
  eq(S.tail.length, 1);
  eq(S.tail.toString(), 'tail :: List a -> Maybe (List a)');

  eq(S.tail([]), S.Nothing);
  eq(S.tail(['foo']), S.Just([]));
  eq(S.tail(['foo', 'bar']), S.Just(['bar']));
  eq(S.tail(['foo', 'bar', 'baz']), S.Just(['bar', 'baz']));

});
