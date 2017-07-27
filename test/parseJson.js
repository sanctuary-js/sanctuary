'use strict';

var $ = require('sanctuary-def');

var S = require('..');

var eq = require('./internal/eq');


test('parseJson', function() {

  eq(typeof S.parseJson, 'function');
  eq(S.parseJson.length, 2);
  eq(S.parseJson.toString(), 'parseJson :: (Any -> Boolean) -> String -> Maybe a');

  eq(S.parseJson(S.is(Object), '[Invalid JSON]'), S.Nothing);
  eq(S.parseJson(S.is(Array), '{"foo":"bar"}'), S.Nothing);
  eq(S.parseJson(S.is(Array), '["foo","bar"]'), S.Just(['foo', 'bar']));

  eq(S.parseJson($.test([], $.Array($.Number)), '[1,2]'), S.Just([1, 2]));
  eq(S.parseJson($.test([], $.Array($.Number)), '[1,2,null]'), S.Nothing);

});
