import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('pipe', () => {

  eq (String (S.pipe), 'pipe :: Foldable f => f (Any -> Any) -> a -> b');

  eq (S.pipe ([]) ('99'), '99');
  eq (S.pipe ([parseInt]) ('99'), 99);
  eq (S.pipe ([parseInt, S.add (1)]) ('99'), 100);
  eq (S.pipe ([parseInt, S.add (1), Math.sqrt]) ('99'), 10);
  eq (S.pipe ([parseInt, S.add (1), Math.sqrt, S.sub (1)]) ('99'), 9);

  eq (S.pipe (Nil) ('99'), '99');
  eq (S.pipe (Cons (parseInt) (Nil)) ('99'), 99);
  eq (S.pipe (Cons (parseInt) (Cons (S.add (1)) (Nil))) ('99'), 100);
  eq (S.pipe (Cons (parseInt) (Cons (S.add (1)) (Cons (Math.sqrt) (Nil)))) ('99'), 10);
  eq (S.pipe (Cons (parseInt) (Cons (S.add (1)) (Cons (Math.sqrt) (Cons (S.sub (1)) (Nil))))) ('99'), 9);

});
