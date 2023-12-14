//# value :: String -> StrMap a -> Maybe a
//.
//. Retrieve the value associated with the given key in the given string map.
//.
//. Formally, `value (k) (m)` evaluates to `Just (m[k])` if `k` is an
//. enumerable own property of `m`; `Nothing` otherwise.
//.
//. See also [`prop`](#prop) and [`get`](#get).
//.
//. ```javascript
//. > S.value ('foo') ({foo: 1, bar: 2})
//. Just (1)
//.
//. > S.value ('bar') ({foo: 1, bar: 2})
//. Just (2)
//.
//. > S.value ('baz') ({foo: 1, bar: 2})
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('value')
  ({})
  ([$.String, $.StrMap (a), $.Maybe (a)])
  (key => strMap =>
     Object.prototype.propertyIsEnumerable.call (strMap, key) ?
     Maybe.Just (strMap[key]) :
     Maybe.Nothing);
