import {deepStrictEqual as eq} from 'node:assert';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('head', () => {

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
