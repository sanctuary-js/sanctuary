'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('id', () => {

  eq (typeof S.id) ('function');
  eq (S.id.length) (1);
  eq (S.show (S.id)) ('id :: Category c => TypeRep c -> c');

  eq (S.id (Function) (42)) (42);

});
