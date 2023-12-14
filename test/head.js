import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import head from 'sanctuary/head';

import {Nil, Cons} from './internal/List.js';


test ('head', () => {

  eq (S.head === head, true);
  eq (String (S.head), 'head :: Foldable f => f a -> Maybe a');

  eq (S.head ([]), S.Nothing);
  eq (S.head (['foo']), S.Just ('foo'));
  eq (S.head (['foo', 'bar']), S.Just ('foo'));
  eq (S.head (['foo', 'bar', 'baz']), S.Just ('foo'));

  eq (S.head (Nil), S.Nothing);
  eq (S.head (Cons ('foo') (Nil)), S.Just ('foo'));
  eq (S.head (Cons ('foo') (Cons ('bar') (Nil))), S.Just ('foo'));
  eq (S.head (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil)))), S.Just ('foo'));

});
