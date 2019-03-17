'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const strMap = require ('./internal/strMap');


test ('pairs', () => {

  eq (typeof S.pairs) ('function');
  eq (S.pairs.length) (1);
  eq (S.show (S.pairs)) ('pairs :: StrMap a -> Array (Pair String a)');

  eq (S.sort (S.pairs ({}))) ([]);
  eq (S.sort (S.pairs ({a: 1, b: 2, c: 3}))) ([S.Pair ('a') (1), S.Pair ('b') (2), S.Pair ('c') (3)]);

  eq (S.pairs (strMap)) ([S.Pair ('enumerable own property') ('enumerable own property')]);

});
