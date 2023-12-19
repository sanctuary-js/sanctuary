'use strict';

const jsc = require ('jsverify');

const S = require ('..');

const eq = require ('./internal/eq');
const equals = require ('./internal/equals');


test ('remove', () => {

  eq (String (S.remove)) ('remove :: String -> StrMap a -> StrMap a');

  eq (S.remove ('a') ({})) ({});
  eq (S.remove ('b') ({a: 1})) ({a: 1});
  eq (S.remove ('c') ({a: 1, b: 2, c: 3})) ({a: 1, b: 2});

  jsc.assert (jsc.forall (jsc.string, jsc.dict (jsc.number), (key, map) => {
    const remove = S.remove (key);
    const lhs = remove (remove (map));
    const rhs = remove (map);
    return equals (lhs) (rhs);
  }), {tests: 1000});

});
