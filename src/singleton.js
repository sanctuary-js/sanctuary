//# singleton :: String -> a -> StrMap a
//.
//. Takes a string and a value of any type, and returns a string map with
//. a single entry (mapping the key to the value).
//.
//. ```javascript
//. > S.singleton ('foo') (42)
//. {foo: 42}
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('singleton')
  ({})
  ([$.String, a, $.StrMap (a)])
  (key => val => ({[key]: val}));
