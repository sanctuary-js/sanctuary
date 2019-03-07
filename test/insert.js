'use strict';

const jsc = require ('jsverify');

const S = require ('..');

const eq = require ('./internal/eq');
const equals = require ('./internal/equals');


test ('insert', () => {

  eq (typeof S.insert) ('function');
  eq (S.insert.length) (1);
  eq (S.show (S.insert)) ('insert :: String -> a -> StrMap a -> StrMap a');

  eq (S.insert ('a') (1) ({})) ({a: 1});
  eq (S.insert ('b') (2) ({a: 1})) ({a: 1, b: 2});
  eq (S.insert ('c') (3) ({a: 1, b: 2, c: 4})) ({a: 1, b: 2, c: 3});

  jsc.assert (jsc.forall (jsc.string, jsc.number, jsc.dict (jsc.number), (key, val, map) => {
    const insert = S.insert (key) (val);
    const lhs = insert (insert (map));
    const rhs = insert (map);
    return equals (lhs) (rhs);
  }), {tests: 1000});

});
