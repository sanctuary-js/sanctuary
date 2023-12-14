//# mapMaybe :: (Filterable f, Functor f) => (a -> Maybe b) -> f a -> f b
//.
//. Takes a function and a structure, applies the function to each element
//. of the structure, and returns the "successful" results. If the result of
//. applying the function to an element is Nothing, the result is discarded;
//. if the result is a Just, the Just's value is included.
//.
//. ```javascript
//. > S.mapMaybe (S.head) ([[], [1, 2, 3], [], [4, 5, 6], []])
//. [1, 4]
//.
//. > S.mapMaybe (S.head) ({x: [1, 2, 3], y: [], z: [4, 5, 6]})
//. {x: 1, z: 4}
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';
import justs from './justs.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('mapMaybe')
  ({f: [Z.Filterable, Z.Functor]})
  ([$.Fn (a) ($.Maybe (b)), f (a), f (b)])
  (f => m => justs (Z.map (f, m)));
