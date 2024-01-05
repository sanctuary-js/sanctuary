import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('lefts', () => {

  eq (String (S.lefts), 'lefts :: (Filterable f, Functor f) => f (Either a b) -> f a');

  eq (S.lefts ([]), []);
  eq (S.lefts ([S.Right (2), S.Right (1)]), []);
  eq (S.lefts ([S.Right (2), S.Left ('b')]), ['b']);
  eq (S.lefts ([S.Left ('a'), S.Right (1)]), ['a']);
  eq (S.lefts ([S.Left ('a'), S.Left ('b')]), ['a', 'b']);

  eq (S.lefts ({}), {});
  eq (S.lefts ({x: S.Right (2), y: S.Right (1)}), {});
  eq (S.lefts ({x: S.Right (2), y: S.Left ('b')}), {y: 'b'});
  eq (S.lefts ({x: S.Left ('a'), y: S.Right (1)}), {x: 'a'});
  eq (S.lefts ({x: S.Left ('a'), y: S.Left ('b')}), {x: 'a', y: 'b'});

  eq (S.lefts (S.Nothing), S.Nothing);
  eq (S.lefts (S.Just (S.Right (1))), S.Nothing);
  eq (S.lefts (S.Just (S.Left ('a'))), S.Just ('a'));

  eq (S.lefts (Nil), Nil);
  eq (S.lefts (Cons (S.Right (2)) (Cons (S.Right (1)) (Nil))), Nil);
  eq (S.lefts (Cons (S.Right (2)) (Cons (S.Left ('b')) (Nil))), Cons ('b') (Nil));
  eq (S.lefts (Cons (S.Left ('a')) (Cons (S.Right (1)) (Nil))), Cons ('a') (Nil));
  eq (S.lefts (Cons (S.Left ('a')) (Cons (S.Left ('b')) (Nil))), Cons ('a') (Cons ('b') (Nil)));

});
