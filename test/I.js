'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const properties = require ('./properties');


test ('I', () => {

  eq (typeof S.I) ('function');
  eq (S.I.length) (1);
  eq (S.show (S.I)) ('I :: a -> a');

  eq (S.I ([1, 2, 3])) ([1, 2, 3]);
  eq (S.I (['foo', 42])) (['foo', 42]);

  eq (properties.idempotent (S.I)) (true);
  eq (properties.involution (S.I)) (true);

  if (typeof document !== 'undefined') {
    //  eslint-disable-next-line no-undef
    const a = document.createElement ('a');
    const href = S.prop ('href');
    eq (href (a)) ('');
    eq (href (S.I (a))) ('');
  }

});
