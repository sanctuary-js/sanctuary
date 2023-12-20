import {deepStrictEqual as eq} from 'assert';

import jsc from 'jsverify';
import Z from 'sanctuary-type-classes';

import S from '../index.js';


test ('insert', () => {

  eq (String (S.insert), 'insert :: String -> a -> StrMap a -> StrMap a');

  eq (S.insert ('a') (1) ({}), {a: 1});
  eq (S.insert ('b') (2) ({a: 1}), {a: 1, b: 2});
  eq (S.insert ('c') (3) ({a: 1, b: 2, c: 4}), {a: 1, b: 2, c: 3});

  jsc.assert (jsc.forall (jsc.string, jsc.number, jsc.dict (jsc.number), (key, val, map) => {
    const insert = S.insert (key) (val);
    const lhs = insert (insert (map));
    const rhs = insert (map);
    return Z.equals (lhs, rhs);
  }), {tests: 1000});

});
