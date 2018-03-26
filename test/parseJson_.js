'use strict';

var $ = require('sanctuary-def');

var S = require('..');

var eq = require('./internal/eq');


test('parseJson_', function() {

  eq(typeof S.parseJson_, 'function');
  eq(S.parseJson_.length, 2);
  eq(S.parseJson_.toString(), 'parseJson_ :: Type -> String -> Maybe a');

  eq(S.parseJson_($.Any, '[Invalid JSON]'), S.Nothing);

  eq(S.parseJson_($.Array($.Number), '[1,2]'), S.Just([1, 2]));
  eq(S.parseJson_($.Array($.Number), '[1,2,null]'), S.Nothing);
  eq(S.parseJson_($.Array($.StrMap($.Integer)), '[]'), S.Just([]));
  eq(S.parseJson_($.Array($.StrMap($.Integer)), '[{},{},{}]'), S.Just([{}, {}, {}]));
  eq(S.parseJson_($.Array($.StrMap($.Integer)), '[{"x":1},{"x":2},{"x":3}]'), S.Just([{x: 1}, {x: 2}, {x: 3}]));
  eq(S.parseJson_($.Array($.StrMap($.Integer)), '[{"x":1},{"x":2},{"x":3.14}]'), S.Nothing);

});
