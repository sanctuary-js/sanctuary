//# insert :: String -> a -> StrMap a -> StrMap a
//.
//. Takes a string, a value of any type, and a string map, and returns a
//. string map comprising all the entries of the given string map plus the
//. entry specified by the first two arguments (which takes precedence).
//.
//. Equivalent to Haskell's `insert` function. Similar to Clojure's `assoc`
//. function.
//.
//. ```javascript
//. > S.insert ('c') (3) ({a: 1, b: 2})
//. {a: 1, b: 2, c: 3}
//.
//. > S.insert ('a') (4) ({a: 1, b: 2})
//. {a: 4, b: 2}
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('insert')
  ({})
  ([$.String, a, $.StrMap (a), $.StrMap (a)])
  (key => val => strMap => Z.concat (strMap, {[key]: val}));
