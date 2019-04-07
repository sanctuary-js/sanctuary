'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('zero', () => {

  eq (typeof S.zero) ('function');
  eq (S.zero.length) (1);
  eq (S.show (S.zero)) ('zero :: Plus f => TypeRep (f a) -> f a');

  eq (S.zero (Array)) ([]);
  eq (S.zero (Object)) ({});
  eq (S.zero (S.Maybe)) (S.Nothing);

});
