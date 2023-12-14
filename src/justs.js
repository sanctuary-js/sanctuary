//# justs :: (Filterable f, Functor f) => f (Maybe a) -> f a
//.
//. Discards each element that is Nothing, and unwraps each element that is
//. a Just. Related to Haskell's `catMaybes` function.
//.
//. See also [`lefts`](#lefts) and [`rights`](#rights).
//.
//. ```javascript
//. > S.justs ([S.Just ('foo'), S.Nothing, S.Just ('baz')])
//. ['foo', 'baz']
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';
import isJust from './isJust.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('justs')
  ({f: [Z.Filterable, Z.Functor]})
  ([f ($.Maybe (a)), f (a)])
  (maybes => Z.map (just => just.value, Z.filter (isJust, maybes)));
