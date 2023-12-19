'use strict';

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');
const eq = require ('./internal/eq');


test ('takeLast', () => {

  eq (String (S.takeLast)) ('takeLast :: (Applicative f, Foldable f, Monoid f) => Integer -> f a -> Maybe (f a)');

  eq (S.takeLast (0) ([1, 2, 3, 4, 5])) (S.Just ([]));
  eq (S.takeLast (1) ([1, 2, 3, 4, 5])) (S.Just ([5]));
  eq (S.takeLast (2) ([1, 2, 3, 4, 5])) (S.Just ([4, 5]));
  eq (S.takeLast (3) ([1, 2, 3, 4, 5])) (S.Just ([3, 4, 5]));
  eq (S.takeLast (4) ([1, 2, 3, 4, 5])) (S.Just ([2, 3, 4, 5]));
  eq (S.takeLast (5) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3, 4, 5]));
  eq (S.takeLast (6) ([1, 2, 3, 4, 5])) (S.Nothing);

  eq (S.takeLast (-1) ([1, 2, 3, 4, 5])) (S.Nothing);

  eq (S.takeLast (0) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Just (Nil));
  eq (S.takeLast (1) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Just (Cons (3) (Nil)));
  eq (S.takeLast (2) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Just (Cons (2) (Cons (3) (Nil))));
  eq (S.takeLast (3) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Just (Cons (1) (Cons (2) (Cons (3) (Nil)))));
  eq (S.takeLast (4) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Nothing);

  eq (S.takeLast (-1) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Nothing);

});
