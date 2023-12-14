import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import last from 'sanctuary/last';

import {Nil, Cons} from './internal/List.js';


test ('last', () => {

  eq (S.last === last, true);
  eq (String (S.last), 'last :: Foldable f => f a -> Maybe a');

  eq (S.last ([]), S.Nothing);
  eq (S.last (['foo']), S.Just ('foo'));
  eq (S.last (['foo', 'bar']), S.Just ('bar'));
  eq (S.last (['foo', 'bar', 'baz']), S.Just ('baz'));

  eq (S.last (Nil), S.Nothing);
  eq (S.last (Cons ('foo') (Nil)), S.Just ('foo'));
  eq (S.last (Cons ('foo') (Cons ('bar') (Nil))), S.Just ('bar'));
  eq (S.last (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil)))), S.Just ('baz'));

});
