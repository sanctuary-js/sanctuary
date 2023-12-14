//# boolean :: a -> a -> Boolean -> a
//.
//. Case analysis for the `Boolean` type. `boolean (x) (y) (b)` evaluates
//. to `x` if `b` is `false`; to `y` if `b` is `true`.
//.
//. ```javascript
//. > S.boolean ('no') ('yes') (false)
//. 'no'
//.
//. > S.boolean ('no') ('yes') (true)
//. 'yes'
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('boolean')
  ({})
  ([a, a, $.Boolean, a])
  (false_ => true_ => boolean => boolean ? true_ : false_);
