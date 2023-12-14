//# elem :: (Setoid a, Foldable f) => a -> f a -> Boolean
//.
//. Takes a value and a structure and returns `true` [iff][] the value is an
//. element of the structure.
//.
//. See also [`elem_`](#elem_) and [`find`](#find).
//.
//. ```javascript
//. > S.elem ('c') (['a', 'b', 'c'])
//. true
//.
//. > S.elem ('x') (['a', 'b', 'c'])
//. false
//.
//. > S.elem (3) ({x: 1, y: 2, z: 3})
//. true
//.
//. > S.elem (8) ({x: 1, y: 2, z: 3})
//. false
//.
//. > S.elem (0) (S.Just (0))
//. true
//.
//. > S.elem (0) (S.Just (1))
//. false
//.
//. > S.elem (0) (S.Nothing)
//. false
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('elem')
  ({a: [Z.Setoid], f: [Z.Foldable]})
  ([a, f (a), $.Boolean])
  (x => foldable => Z.elem (x, foldable));
