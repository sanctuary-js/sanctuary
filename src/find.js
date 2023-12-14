//# find :: Foldable f => (a -> Boolean) -> f a -> Maybe a
//.
//. Takes a predicate and a structure and returns Just the leftmost element
//. of the structure that satisfies the predicate; Nothing if there is no
//. such element.
//.
//. See also [`findMap`](#findMap) and [`elem`](#elem).
//.
//. ```javascript
//. > S.find (S.lt (0)) ([1, -2, 3, -4, 5])
//. Just (-2)
//.
//. > S.find (S.lt (0)) ([1, 2, 3, 4, 5])
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';
import findMap from './findMap.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('find')
  ({f: [Z.Foldable]})
  ([$.Predicate (a), f (a), $.Maybe (a)])
  (pred => findMap (x => pred (x) ? Maybe.Just (x) : Maybe.Nothing));
