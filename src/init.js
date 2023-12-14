//# init :: (Applicative f, Foldable f, Monoid (f a)) => f a -> Maybe (f a)
//.
//. Returns Just all but the last of the given structure's elements if the
//. structure contains at least one element; Nothing otherwise.
//.
//. ```javascript
//. > S.init ([1, 2, 3])
//. Just ([1, 2])
//.
//. > S.init ([])
//. Nothing
//.
//. > S.init (Cons (1) (Cons (2) (Cons (3) (Nil))))
//. Just (Cons (1) (Cons (2) (Nil)))
//.
//. > S.init (Nil)
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('init')
  ({f: [Z.Applicative, Z.Foldable, Z.Monoid]})
  ([f (a), $.Maybe (f (a))])
  (foldable => {
     //  Fast path for arrays.
     if (Array.isArray (foldable)) {
       return foldable.length > 0 ? Maybe.Just (foldable.slice (0, -1))
                                  : Maybe.Nothing;
     }
     const e = Z.empty (foldable.constructor);
     const reducer = (m, x) => (
       Maybe.Just ([m.isNothing ? e : Z.append (m.value[1], m.value[0]), x])
     );
     return Z.map (
       ([init]) => init,
       Z.reduce (reducer, Maybe.Nothing, foldable)
     );
   });
