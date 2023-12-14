//# foldMap :: (Monoid m, Foldable f) => TypeRep m -> (a -> m) -> f a -> m
//.
//. Curried version of [`Z.foldMap`][]. Deconstructs a foldable by mapping
//. every element to a monoid and concatenating the results.
//.
//. ```javascript
//. > S.foldMap (String) (f => f.name) ([Math.sin, Math.cos, Math.tan])
//. 'sincostan'
//.
//. > S.foldMap (Array) (x => [x + 1, x + 2]) ([10, 20, 30])
//. [11, 12, 21, 22, 31, 32]
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import TypeRep from './internal/TypeRep.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('foldMap')
  ({b: [Z.Monoid], f: [Z.Foldable]})
  ([TypeRep (b), $.Fn (a) (b), f (a), b])
  (typeRep => f => foldable => Z.foldMap (typeRep, f, foldable));
