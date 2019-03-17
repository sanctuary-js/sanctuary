'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const strMap = require ('./internal/strMap');


test ('values', () => {

  eq (typeof S.values) ('function');
  eq (S.values.length) (1);
  eq (S.show (S.values)) ('values :: StrMap a -> Array a');

  eq (S.sort (S.values ({}))) ([]);
  eq (S.sort (S.values ({a: 1, b: 2, c: 3}))) ([1, 2, 3]);

  eq (S.values (strMap)) (['enumerable own property']);

});
