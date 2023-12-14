//# pipe :: Foldable f => f (Any -> Any) -> a -> b
//.
//. Takes a sequence of functions assumed to be unary and a value of any
//. type, and returns the result of applying the sequence of transformations
//. to the initial value.
//.
//. In general terms, `pipe` performs left-to-right composition of a sequence
//. of functions. `pipe ([f, g, h]) (x)` is equivalent to `h (g (f (x)))`.
//.
//. ```javascript
//. > S.pipe ([S.add (1), Math.sqrt, S.sub (1)]) (99)
//. 9
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f} = makeTypeVars ({a: 0, b: 0, f: 1});

export default def
  ('pipe')
  ({f: [Z.Foldable]})
  ([f ($.Fn ($.Any) ($.Any)), a, b])
  (fs => x => Z.reduce ((x, f) => f (x), x, fs));
