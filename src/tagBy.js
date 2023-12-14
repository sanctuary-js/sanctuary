//# tagBy :: (a -> Boolean) -> a -> Either a a
//.
//. Takes a predicate and a value, and returns a Right of the value if it
//. satisfies the predicate; a Left of the value otherwise.
//.
//. ```javascript
//. > S.tagBy (S.odd) (0)
//. Left (0)
//
//. > S.tagBy (S.odd) (1)
//. Right (1)
//. ```

import $ from 'sanctuary-def';
import Either from 'sanctuary-either';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('tagBy')
  ({})
  ([$.Predicate (a), a, $.Either (a) (a)])
  (pred => x => pred (x) ? Either.Right (x) : Either.Left (x));
