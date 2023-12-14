//# findMap :: Foldable f => (a -> Maybe b) -> f a -> Maybe b
//.
//. Finds the leftmost element of the given structure for which the given
//. function returns a Just, and returns that Just (or Nothing if none of
//. the elements matches).
//.
//. More flexible than [`find`](#find), and more convenient in situations
//. in which the result of a successful computation can be reused.
//.
//. ```javascript
//. > S.findMap (S.parseInt (16)) ([])
//. Nothing
//.
//. > S.findMap (S.parseInt (16)) (['X', 'Y', 'Z'])
//. Nothing
//.
//. > S.findMap (S.parseInt (16)) (['A', 'B', 'C'])
//. Just (10)
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('findMap')
  ({f: [Z.Foldable]})
  ([$.Fn (a) ($.Maybe (b)), f (a), $.Maybe (b)])
  (f => xs => Z.reduce ((m, x) => m.isJust ? m : f (x), Maybe.Nothing, xs));
