'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('pairs', () => {

  eq (typeof S.pairs) ('function');
  eq (S.pairs.length) (1);
  eq (S.show (S.pairs)) ('pairs :: StrMap a -> Array (Pair String a)');

  eq (S.sort (S.pairs ({}))) ([]);
  eq (S.sort (S.pairs ({a: 1, b: 2, c: 3}))) ([S.Pair ('a') (1), S.Pair ('b') (2), S.Pair ('c') (3)]);

  const proto = {a: 1, b: 2};
  const obj = Object.create (proto);
  obj.c = 3;
  obj.d = 4;

  eq (S.sort (S.pairs (obj))) ([S.Pair ('c') (3), S.Pair ('d') (4)]);

});
