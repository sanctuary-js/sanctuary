'use strict';

const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');

const S = require ('..');

const eq = require ('./internal/eq');


test ('insert', () => {

  eq (String (S.insert)) ('insert :: String -> a -> StrMap a -> StrMap a');

  eq (S.insert ('a') (1) ({})) ({a: 1});
  eq (S.insert ('b') (2) ({a: 1})) ({a: 1, b: 2});
  eq (S.insert ('c') (3) ({a: 1, b: 2, c: 4})) ({a: 1, b: 2, c: 3});

  jsc.assert (jsc.forall (jsc.string, jsc.number, jsc.dict (jsc.number), (key, val, map) => {
    const insert = S.insert (key) (val);
    const lhs = insert (insert (map));
    const rhs = insert (map);
    return Z.equals (lhs, rhs);
  }), {tests: 1000});

});
