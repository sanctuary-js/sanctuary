'use strict';

var S = require ('..');

var eq = require ('./internal/eq');
var properties = require ('./properties');


test ('I', function() {

  eq (typeof S.I) ('function');
  eq (S.I.length) (1);
  eq (String (S.I)) ('I :: a -> a');

  eq (S.I ([1, 2, 3])) ([1, 2, 3]);
  eq (S.I (['foo', 42])) (['foo', 42]);

  eq (properties.idempotent (S.I)) (true);
  eq (properties.involution (S.I)) (true);

});
