//# last :: Foldable f => f a -> Maybe a
//.
//. Returns Just the last element of the given structure if the structure
//. contains at least one element; Nothing otherwise.
//.
//. ```javascript
//. > S.last ([1, 2, 3])
//. Just (3)
//.
//. > S.last ([])
//. Nothing
//.
//. > S.last (Cons (1) (Cons (2) (Cons (3) (Nil))))
//. Just (3)
//.
//. > S.last (Nil)
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('last')
  ({f: [Z.Foldable]})
  ([f (a), $.Maybe (a)])
  (foldable => {
     //  Fast path for arrays.
     if (Array.isArray (foldable)) {
       return (
         foldable.length > 0 ?
         Maybe.Just (foldable[foldable.length - 1]) :
         Maybe.Nothing
       );
     }
     return Z.reduce ((_, x) => Maybe.Just (x), Maybe.Nothing, foldable);
   });
