//# tail :: (Applicative f, Foldable f, Monoid (f a)) => f a -> Maybe (f a)
//.
//. Returns Just all but the first of the given structure's elements if the
//. structure contains at least one element; Nothing otherwise.
//.
//. ```javascript
//. > S.tail ([1, 2, 3])
//. Just ([2, 3])
//.
//. > S.tail ([])
//. Nothing
//.
//. > S.tail (Cons (1) (Cons (2) (Cons (3) (Nil))))
//. Just (Cons (2) (Cons (3) (Nil)))
//
//. > S.tail (Nil)
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('tail')
  ({f: [Z.Applicative, Z.Foldable, Z.Monoid]})
  ([f (a), $.Maybe (f (a))])
  (foldable => {
     //  Fast path for arrays.
     if (Array.isArray (foldable)) {
       return foldable.length > 0 ? Maybe.Just (foldable.slice (1))
                                  : Maybe.Nothing;
     }
     const reducer = (m, x) => Maybe.Just (
       m.isNothing ? Z.empty (foldable.constructor) : Z.append (x, m.value)
     );
     return Z.reduce (reducer, Maybe.Nothing, foldable);
   });
