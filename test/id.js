'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('id', () => {

  eq (String (S.id), 'id :: Category c => TypeRep c -> c');

  eq (S.id (Function) (42), 42);

});
