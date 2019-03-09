'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('unchecked', () => {

  eq (S.unchecked.add (2) (2)) (4);
  eq (S.unchecked.add (2) ('2')) ('22');
  eq (S.unchecked.add ('2') (2)) ('22');
  eq (S.unchecked.add ('2') ('2')) ('22');

});
