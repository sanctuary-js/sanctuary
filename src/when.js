//# when :: (a -> Boolean) -> (a -> a) -> a -> a
//.
//. Takes a unary predicate, a unary function, and a value of any type, and
//. returns the result of applying the function to the value if the value
//. satisfies the predicate; the value otherwise.
//.
//. See also [`unless`](#unless) and [`ifElse`](#ifElse).
//.
//. ```javascript
//. > S.when (x => x >= 0) (Math.sqrt) (16)
//. 4
//.
//. > S.when (x => x >= 0) (Math.sqrt) (-1)
//. -1
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('when')
  ({})
  ([$.Predicate (a), $.Fn (a) (a), a, a])
  (pred => f => x => pred (x) ? f (x) : x);
