'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('unchecked', function() {

  eq (S.unchecked.add (2) (2)) (4);
  eq (S.unchecked.add (2) ('2')) ('22');
  eq (S.unchecked.add ('2') (2)) ('22');
  eq (S.unchecked.add ('2') ('2')) ('22');

});
