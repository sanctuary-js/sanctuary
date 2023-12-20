'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('empty', () => {

  eq (String (S.empty), 'empty :: Monoid a => TypeRep a -> a');

  eq (S.empty (String), '');
  eq (S.empty (Array), []);
  eq (S.empty (Object), {});

});
