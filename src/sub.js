//# sub :: FiniteNumber -> FiniteNumber -> FiniteNumber
//.
//. Takes a finite number `n` and returns the _subtract `n`_ function.
//.
//. ```javascript
//. > S.map (S.sub (1)) ([1, 2, 3])
//. [0, 1, 2]
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('sub')
  ({})
  ([$.FiniteNumber, $.FiniteNumber, $.FiniteNumber])
  (y => x => x - y);
