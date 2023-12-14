//# pipeK :: (Foldable f, Chain m) => f (Any -> m Any) -> m a -> m b
//.
//. Takes a sequence of functions assumed to be unary that return values
//. with a [Chain][], and a value of that Chain, and returns the result
//. of applying the sequence of transformations to the initial value.
//.
//. In general terms, `pipeK` performs left-to-right [Kleisli][] composition
//. of an sequence of functions. `pipeK ([f, g, h]) (x)` is equivalent to
//. `chain (h) (chain (g) (chain (f) (x)))`.
//.
//. ```javascript
//. > S.pipeK ([S.tail, S.tail, S.head]) (S.Just ([1, 2, 3, 4]))
//. Just (3)
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f, m} = makeTypeVars ({a: 0, b: 0, f: 1, m: 1});

export default def
  ('pipeK')
  ({f: [Z.Foldable], m: [Z.Chain]})
  ([f ($.Fn ($.Any) (m ($.Any))), m (a), m (b)])
  (fs => x => Z.reduce ((x, f) => Z.chain (f, x), x, fs));
