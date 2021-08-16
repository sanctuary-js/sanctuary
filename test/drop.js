'use strict';

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');
const eq = require ('./internal/eq');


test ('drop', () => {

  eq (S.show (S.drop)) ('drop :: (Applicative f, Foldable f, Monoid f) => Integer -> f a -> Maybe (f a)');

  eq (S.drop (0) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3, 4, 5]));
  eq (S.drop (1) ([1, 2, 3, 4, 5])) (S.Just ([2, 3, 4, 5]));
  eq (S.drop (2) ([1, 2, 3, 4, 5])) (S.Just ([3, 4, 5]));
  eq (S.drop (3) ([1, 2, 3, 4, 5])) (S.Just ([4, 5]));
  eq (S.drop (4) ([1, 2, 3, 4, 5])) (S.Just ([5]));
  eq (S.drop (5) ([1, 2, 3, 4, 5])) (S.Just ([]));
  eq (S.drop (6) ([1, 2, 3, 4, 5])) (S.Nothing);

  eq (S.drop (-1) ([1, 2, 3, 4, 5])) (S.Nothing);

  eq (S.drop (0) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Just (Cons (1) (Cons (2) (Cons (3) (Nil)))));
  eq (S.drop (1) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Just (Cons (2) (Cons (3) (Nil))));
  eq (S.drop (2) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Just (Cons (3) (Nil)));
  eq (S.drop (3) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Just (Nil));
  eq (S.drop (4) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Nothing);

  eq (S.drop (-1) (Cons (1) (Cons (2) (Cons (3) (Nil))))) (S.Nothing);

  // eq (S.unchecked.drop (0) (new Uint8Array([10, 20, 30, 40, 50]))) (S.unchecked.Just (new Uint8Array([10, 20, 30, 40, 50])));
  eq (S.unchecked.drop (1) (new Uint8Array([10, 20, 30, 40, 50]))) (S.unchecked.Just (new Uint8Array([20, 30, 40, 50])));

});
