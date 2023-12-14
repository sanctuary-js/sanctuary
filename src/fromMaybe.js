//# fromMaybe :: a -> Maybe a -> a
//.
//. Takes a default value and a Maybe, and returns the Maybe's value
//. if the Maybe is a Just; the default value otherwise.
//.
//. See also [`maybe`](#maybe), [`fromMaybe_`](#fromMaybe_), and
//. [`maybeToNullable`](#maybeToNullable).
//.
//. ```javascript
//. > S.fromMaybe (0) (S.Just (42))
//. 42
//.
//. > S.fromMaybe (0) (S.Nothing)
//. 0
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('fromMaybe')
  ({})
  ([a, $.Maybe (a), a])
  (nothing => maybe => maybe.isJust ? maybe.value : nothing);
