'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('empty', () => {

  eq (S.show (S.empty)) ('empty :: Monoid a => TypeRep a -> a');

  eq (S.empty (String)) ('');
  eq (S.empty (Array)) ([]);
  eq (S.empty (Object)) ({});

});
