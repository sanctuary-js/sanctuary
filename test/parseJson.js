'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('parseJson', function() {

  eq(typeof S.parseJson, 'function');
  eq(S.parseJson.length, 2);
  eq(S.parseJson.toString(), 'parseJson :: (a -> Boolean) -> String -> Maybe b');

  eq(S.parseJson(S.is(Object), '[Invalid JSON]'), S.Nothing);
  eq(S.parseJson(S.is(Array), '{"foo":"bar"}'), S.Nothing);
  eq(S.parseJson(S.is(Array), '["foo","bar"]'), S.Just(['foo', 'bar']));

});
