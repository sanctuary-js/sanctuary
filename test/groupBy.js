'use strict';

const jsc = require ('jsverify');

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');
const eq = require ('./internal/eq');
const equals = require ('./internal/equals');


test ('groupBy', () => {

  eq (S.show (S.groupBy)) ('groupBy :: (Applicative f, Foldable f, Monoid f) => (a -> a -> Boolean) -> f a -> f (f a)');

  //    never :: (Applicative f, Foldable f, Monoid (f a)) => f a -> f (f a)
  const never = S.groupBy (x => y => false);

  //    always :: (Applicative f, Foldable f, Monoid (f a)) => f a -> f (f a)
  const always = S.groupBy (x => y => true);

  eq (never ([])) ([]);
  eq (never ([1])) ([[1]]);
  eq (never ([1, 2])) ([[1], [2]]);
  eq (never ([1, 2, 3])) ([[1], [2], [3]]);

  eq (always ([])) ([]);
  eq (always ([1])) ([[1]]);
  eq (always ([1, 2])) ([[1, 2]]);
  eq (always ([1, 2, 3])) ([[1, 2, 3]]);

  eq (S.groupBy (x => y => x * y % 3 === 0) ([])) ([]);
  eq (S.groupBy (x => y => x * y % 3 === 0) ([1, 2, 3, 4, 5, 6, 7, 8, 9])) ([[1], [2, 3], [4], [5, 6], [7], [8, 9]]);
  eq (S.groupBy (equals) ([1, 1, 2, 1, 1])) ([[1, 1], [2], [1, 1]]);
  eq (S.groupBy (x => y => x + y === 0) ([2, -3, 3, 3, 3, 4, -4, 4])) ([[2], [-3, 3, 3, 3], [4, -4], [4]]);

  eq (never (Nil))
     (Nil);
  eq (never (Cons (1) (Nil)))
     (Cons (Cons (1) (Nil)) (Nil));
  eq (never (Cons (1) (Cons (2) (Nil))))
     (Cons (Cons (1) (Nil)) (Cons (Cons (2) (Nil)) (Nil)));
  eq (never (Cons (1) (Cons (2) (Cons (3) (Nil)))))
     (Cons (Cons (1) (Nil)) (Cons (Cons (2) (Nil)) (Cons (Cons (3) (Nil)) (Nil))));

  eq (always (Nil))
     (Nil);
  eq (always (Cons (1) (Nil)))
     (Cons (Cons (1) (Nil)) (Nil));
  eq (always (Cons (1) (Cons (2) (Nil))))
     (Cons (Cons (1) (Cons (2) (Nil))) (Nil));
  eq (always (Cons (1) (Cons (2) (Cons (3) (Nil)))))
     (Cons (Cons (1) (Cons (2) (Cons (3) (Nil)))) (Nil));

  eq (S.groupBy (equals)
                (Cons (1) (Cons (1) (Cons (2) (Cons (1) (Cons (1) (Nil)))))))
     (Cons (Cons (1) (Cons (1) (Nil)))
           (Cons (Cons (2) (Nil))
                 (Cons (Cons (1) (Cons (1) (Nil)))
                       (Nil))));

  jsc.assert (jsc.forall ('nat -> nat -> bool', 'array nat', (f, xs) => {
    const lhs = S.join (S.groupBy (f) (xs));
    const rhs = xs;
    return equals (lhs) (rhs);
  }), {tests: 1000});

});
