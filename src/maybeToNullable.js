//# maybeToNullable :: Maybe a -> Nullable a
//.
//. Returns the given Maybe's value if the Maybe is a Just; `null` otherwise.
//. [Nullable][] is defined in [sanctuary-def][].
//.
//. See also [`fromMaybe`](#fromMaybe).
//.
//. ```javascript
//. > S.maybeToNullable (S.Just (42))
//. 42
//.
//. > S.maybeToNullable (S.Nothing)
//. null
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('maybeToNullable')
  ({})
  ([$.Maybe (a), $.Nullable (a)])
  (maybe => maybe.isJust ? maybe.value : null);
