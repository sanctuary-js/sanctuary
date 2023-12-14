//# complement :: (a -> Boolean) -> a -> Boolean
//.
//. Takes a unary predicate and a value of any type, and returns the logical
//. negation of applying the predicate to the value.
//.
//. See also [`not`](#not).
//.
//. ```javascript
//. > Number.isInteger (42)
//. true
//.
//. > S.complement (Number.isInteger) (42)
//. false
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('complement')
  ({})
  ([$.Predicate (a), a, $.Boolean])
  (pred => x => !(pred (x)));
