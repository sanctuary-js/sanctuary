//# fromPairs :: Foldable f => f (Pair String a) -> StrMap a
//.
//. Returns a string map containing the key–value pairs specified by the
//. given [Foldable][]. If a key appears in multiple pairs, the rightmost
//. pair takes precedence.
//.
//. ```javascript
//. > S.fromPairs ([S.Pair ('a') (1), S.Pair ('b') (2), S.Pair ('c') (3)])
//. {a: 1, b: 2, c: 3}
//.
//. > S.fromPairs ([S.Pair ('x') (1), S.Pair ('x') (2)])
//. {x: 2}
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('fromPairs')
  ({f: [Z.Foldable]})
  ([f ($.Pair ($.String) (a)), $.StrMap (a)])
  (pairs => Z.reduce ((sm, [key, val]) => ((sm[key] = val, sm)), {}, pairs));
