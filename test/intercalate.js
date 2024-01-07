import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('intercalate', () => {

  eq (String (S.intercalate), 'intercalate :: (Monoid a, Foldable f) => a -> f a -> a');

  eq (S.intercalate (', ') ([]), '');
  eq (S.intercalate (', ') (['foo']), 'foo');
  eq (S.intercalate (', ') (['foo', 'bar']), 'foo, bar');
  eq (S.intercalate (', ') (['foo', 'bar', 'baz']), 'foo, bar, baz');
  eq (S.intercalate ([0, 0, 0]) ([]), []);
  eq (S.intercalate ([0, 0, 0]) ([[1]]), [1]);
  eq (S.intercalate ([0, 0, 0]) ([[1], [2]]), [1, 0, 0, 0, 2]);
  eq (S.intercalate ([0, 0, 0]) ([[1], [2], [3]]), [1, 0, 0, 0, 2, 0, 0, 0, 3]);
  eq (S.intercalate ('.') (Nil), '');
  eq (S.intercalate ('.') (Cons ('x') (Nil)), 'x');
  eq (S.intercalate ('.') (Cons ('x') (Cons ('y') (Nil))), 'x.y');
  eq (S.intercalate ('.') (Cons ('x') (Cons ('y') (Cons ('z') (Nil)))), 'x.y.z');

});
