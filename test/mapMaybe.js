import {deepStrictEqual as eq} from 'node:assert';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('mapMaybe', () => {

  eq (String (S.mapMaybe), 'mapMaybe :: (Filterable f, Functor f) => (a -> Maybe b) -> f a -> f b');

  eq (S.mapMaybe (S.head) ([]), []);
  eq (S.mapMaybe (S.head) ([[], [], []]), []);
  eq (S.mapMaybe (S.head) ([[1, 2], [3, 4], [5, 6]]), [1, 3, 5]);
  eq (S.mapMaybe (S.head) ([[1], [], [3], [], [5], []]), [1, 3, 5]);

  eq (S.mapMaybe (S.head) ({}), {});
  eq (S.mapMaybe (S.head) ({a: [], b: [], c: []}), {});
  eq (S.mapMaybe (S.head) ({a: [1, 2], b: [3, 4], c: [5, 6]}), {a: 1, b: 3, c: 5});
  eq (S.mapMaybe (S.head) ({a: [1], b: [], c: [3], d: [], e: [5], f: []}), {a: 1, c: 3, e: 5});

  eq (S.mapMaybe (S.head) (S.Nothing), S.Nothing);
  eq (S.mapMaybe (S.head) (S.Just ([])), S.Nothing);
  eq (S.mapMaybe (S.head) (S.Just ([1, 2])), S.Just (1));

  eq (S.mapMaybe (S.head) (Nil),
      Nil);
  eq (S.mapMaybe (S.head) (Cons ([]) (Cons ([]) (Cons ([]) (Nil)))),
      Nil);
  eq (S.mapMaybe (S.head) (Cons ([1, 2]) (Cons ([3, 4]) (Cons ([5, 6]) (Nil)))),
      Cons (1) (Cons (3) (Cons (5) (Nil))));
  eq (S.mapMaybe (S.head) (Cons ([1]) (Cons ([]) (Cons ([3]) (Cons ([]) (Cons ([5]) (Cons ([]) (Nil))))))),
      Cons (1) (Cons (3) (Cons (5) (Nil))));

});
