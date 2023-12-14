//# chain :: Chain m => (a -> m b) -> m a -> m b
//.
//. Curried version of [`Z.chain`][].
//.
//. ```javascript
//. > S.chain (x => [x, x]) ([1, 2, 3])
//. [1, 1, 2, 2, 3, 3]
//.
//. > S.chain (n => s => s.slice (0, n)) (s => Math.ceil (s.length / 2)) ('slice')
//. 'sli'
//.
//. > S.chain (S.parseInt (10)) (S.Just ('123'))
//. Just (123)
//.
//. > S.chain (S.parseInt (10)) (S.Just ('XXX'))
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, m} = makeTypeVars ({a: 0, b: 0, m: 1});

export default def
  ('chain')
  ({m: [Z.Chain]})
  ([$.Fn (a) (m (b)), m (a), m (b)])
  (f => chain => Z.chain (f, chain));
