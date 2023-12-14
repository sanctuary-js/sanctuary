//# maybe :: b -> (a -> b) -> Maybe a -> b
//.
//. Takes a value of any type, a function, and a Maybe. If the Maybe is
//. a Just, the return value is the result of applying the function to
//. the Just's value. Otherwise, the first argument is returned.
//.
//. See also [`maybe_`](#maybe_) and [`fromMaybe`](#fromMaybe).
//.
//. ```javascript
//. > S.maybe (0) (S.prop ('length')) (S.Just ('refuge'))
//. 6
//.
//. > S.maybe (0) (S.prop ('length')) (S.Nothing)
//. 0
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('maybe')
  ({})
  ([b, $.Fn (a) (b), $.Maybe (a), b])
  (nothing => just => maybe => maybe.isJust ? just (maybe.value) : nothing);
