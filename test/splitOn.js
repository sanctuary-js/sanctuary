import {deepStrictEqual as eq} from 'assert';

import jsc from 'jsverify';
import Z from 'sanctuary-type-classes';

import S from '../index.js';


test ('splitOn', () => {

  eq (String (S.splitOn), 'splitOn :: String -> String -> Array String');

  eq (S.splitOn ('') ('abc'), ['a', 'b', 'c']);
  eq (S.splitOn (':') (''), ['']);
  eq (S.splitOn (':') (':'), ['', '']);
  eq (S.splitOn (':') (':foo:'), ['', 'foo', '']);
  eq (S.splitOn (':') ('foo:bar:baz'), ['foo', 'bar', 'baz']);
  eq (S.splitOn ('::') ('foo::bar::baz'), ['foo', 'bar', 'baz']);

  jsc.assert (jsc.forall (jsc.asciistring, t => {
    const min = 0;
    const max = t.length;
    const i = jsc.random (min, max);
    const j = jsc.random (min, max);
    const s = t.slice (Math.min (i, j), Math.max (i, j));
    const lhs = S.joinWith (s) (S.splitOn (s) (t));
    const rhs = t;
    return Z.equals (lhs, rhs);
  }), {tests: 1000});

});
