'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('id', () => {

  eq (String (S.id)) ('id :: Category c => TypeRep c -> c');

  eq (S.id (Function) (42)) (42);

});
