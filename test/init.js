import {deepStrictEqual as eq} from 'node:assert';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('init', () => {

  eq (String (S.init), 'init :: (Applicative f, Foldable f, Monoid f) => f a -> Maybe (f a)');

  eq (S.init ([]), S.Nothing);
  eq (S.init (['foo']), S.Just ([]));
  eq (S.init (['foo', 'bar']), S.Just (['foo']));
  eq (S.init (['foo', 'bar', 'baz']), S.Just (['foo', 'bar']));

  eq (S.init (Nil), S.Nothing);
  eq (S.init (Cons ('foo') (Nil)), S.Just (Nil));
  eq (S.init (Cons ('foo') (Cons ('bar') (Nil))), S.Just (Cons ('foo') (Nil)));
  eq (S.init (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil)))), S.Just (Cons ('foo') (Cons ('bar') (Nil))));

});
