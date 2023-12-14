import {deepStrictEqual as eq} from 'node:assert';

import jsc from 'jsverify';
import test from 'oletus';
import Z from 'sanctuary-type-classes';

import * as S from 'sanctuary';
import remove from 'sanctuary/remove';


test ('remove', () => {

  eq (S.remove === remove, true);
  eq (String (S.remove), 'remove :: String -> StrMap a -> StrMap a');

  eq (S.remove ('a') ({}), {});
  eq (S.remove ('b') ({a: 1}), {a: 1});
  eq (S.remove ('c') ({a: 1, b: 2, c: 3}), {a: 1, b: 2});

  jsc.assert (jsc.forall (jsc.string, jsc.dict (jsc.number), (key, map) => {
    const remove = S.remove (key);
    const lhs = remove (remove (map));
    const rhs = remove (map);
    return Z.equals (lhs, rhs);
  }), {tests: 1000});

});
