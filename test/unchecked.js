'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('unchecked', () => {

  eq (S.unchecked.add (2) (2), 4);
  eq (S.unchecked.add (2) ('2'), '22');
  eq (S.unchecked.add ('2') (2), '22');
  eq (S.unchecked.add ('2') ('2'), '22');

});
