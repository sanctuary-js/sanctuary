'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const properties = require ('./properties');


test ('I', () => {

  eq (String (S.I)) ('I :: a -> a');

  eq (S.I ([1, 2, 3])) ([1, 2, 3]);
  eq (S.I (['foo', 42])) (['foo', 42]);

  eq (properties.idempotent (S.I)) (true);
  eq (properties.involution (S.I)) (true);

});
