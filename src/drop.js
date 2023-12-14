//# drop :: (Applicative f, Foldable f, Monoid (f a)) => Integer -> f a -> Maybe (f a)
//.
//. Returns Just all but the first N elements of the given structure if
//. N is non-negative and less than or equal to the size of the structure;
//. Nothing otherwise.
//.
//. ```javascript
//. > S.drop (0) (['foo', 'bar'])
//. Just (['foo', 'bar'])
//.
//. > S.drop (1) (['foo', 'bar'])
//. Just (['bar'])
//.
//. > S.drop (2) (['foo', 'bar'])
//. Just ([])
//.
//. > S.drop (3) (['foo', 'bar'])
//. Nothing
//.
//. > S.drop (3) (Cons (1) (Cons (2) (Cons (3) (Cons (4) (Cons (5) (Nil))))))
//. Just (Cons (4) (Cons (5) (Nil)))
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('drop')
  ({f: [Z.Applicative, Z.Foldable, Z.Monoid]})
  ([$.Integer, f (a), $.Maybe (f (a))])
  (n => xs => {
     if (n < 0) return Maybe.Nothing;
     //  Fast path for arrays.
     if (Array.isArray (xs)) {
       return n <= xs.length ? Maybe.Just (xs.slice (n)) : Maybe.Nothing;
     }
     const r = Z.reduce (
       (r, x) => r.n < n ? (r.n += 1, r) : (r.xs = Z.append (x, r.xs), r),
       {n: 0, xs: Z.empty (xs.constructor)},
       xs
     );
     return r.n < n ? Maybe.Nothing : Maybe.Just (r.xs);
   });
