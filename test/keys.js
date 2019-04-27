'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const strMap = require ('./internal/strMap');


test ('keys', () => {

  eq (S.show (S.keys)) ('keys :: StrMap a -> Array String');

  eq (S.sort (S.keys ({}))) ([]);
  eq (S.sort (S.keys ({a: 1, b: 2, c: 3}))) (['a', 'b', 'c']);

  eq (S.keys (strMap)) (['enumerable own property']);

});
