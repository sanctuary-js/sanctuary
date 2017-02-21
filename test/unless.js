'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('unless', function() {

  eq(typeof S.unless, 'function');
  eq(S.unless.length, 3);
  eq(S.unless.toString(), 'unless :: (a -> Boolean) -> (a -> a) -> a -> a');

  function lt0(x) { return x < 0; }

  eq(S.unless(lt0, Math.sqrt, 16), 4);
  eq(S.unless(lt0, Math.sqrt, -1), -1);

});
