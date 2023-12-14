//# remove :: String -> StrMap a -> StrMap a
//.
//. Takes a string and a string map, and returns a string map comprising all
//. the entries of the given string map except the one whose key matches the
//. given string (if such a key exists).
//.
//. Equivalent to Haskell's `delete` function. Similar to Clojure's `dissoc`
//. function.
//.
//. ```javascript
//. > S.remove ('c') ({a: 1, b: 2, c: 3})
//. {a: 1, b: 2}
//.
//. > S.remove ('c') ({})
//. {}
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('remove')
  ({})
  ([$.String, $.StrMap (a), $.StrMap (a)])
  (key => strMap => {
     const result = Z.concat (strMap, {});
     delete result[key];
     return result;
   });
