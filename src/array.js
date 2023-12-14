//# array :: b -> (a -> Array a -> b) -> Array a -> b
//.
//. Case analysis for the `Array a` type.
//.
//. ```javascript
//. > S.array (S.Nothing) (head => tail => S.Just (head)) ([])
//. Nothing
//.
//. > S.array (S.Nothing) (head => tail => S.Just (head)) ([1, 2, 3])
//. Just (1)
//.
//. > S.array (S.Nothing) (head => tail => S.Just (tail)) ([])
//. Nothing
//.
//. > S.array (S.Nothing) (head => tail => S.Just (tail)) ([1, 2, 3])
//. Just ([2, 3])
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('array')
  ({})
  ([b, $.Fn (a) ($.Fn ($.Array (a)) (b)), $.Array (a), b])
  (empty => nonEmpty => array =>
     array.length === 0 ? empty : nonEmpty (array[0]) (array.slice (1)));
