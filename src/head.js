//# head :: Foldable f => f a -> Maybe a
//.
//. Returns Just the first element of the given structure if the structure
//. contains at least one element; Nothing otherwise.
//.
//. ```javascript
//. > S.head ([1, 2, 3])
//. Just (1)
//.
//. > S.head ([])
//. Nothing
//.
//. > S.head (Cons (1) (Cons (2) (Cons (3) (Nil))))
//. Just (1)
//.
//. > S.head (Nil)
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('head')
  ({f: [Z.Foldable]})
  ([f (a), $.Maybe (a)])
  (foldable => {
     //  Fast path for arrays.
     if (Array.isArray (foldable)) {
       return foldable.length > 0 ? Maybe.Just (foldable[0]) : Maybe.Nothing;
     }
     return Z.reduce (
       (m, x) => m.isJust ? m : Maybe.Just (x),
       Maybe.Nothing,
       foldable
     );
   });
