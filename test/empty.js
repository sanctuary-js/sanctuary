'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('empty', function() {

  eq (typeof S.empty) ('function');
  eq (S.empty.length) (1);
  eq (S.show (S.empty)) ('empty :: Monoid a => TypeRep a -> a');

  eq (S.empty (String)) ('');
  eq (S.empty (Array)) ([]);
  eq (S.empty (Object)) ({});

});
