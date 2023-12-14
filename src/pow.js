//# pow :: FiniteNumber -> FiniteNumber -> FiniteNumber
//.
//. Takes a finite number `n` and returns the _power of `n`_ function.
//.
//. ```javascript
//. > S.map (S.pow (2)) ([-3, -2, -1, 0, 1, 2, 3])
//. [9, 4, 1, 0, 1, 4, 9]
//.
//. > S.map (S.pow (0.5)) ([1, 4, 9, 16, 25])
//. [1, 2, 3, 4, 5]
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('pow')
  ({})
  ([$.FiniteNumber, $.FiniteNumber, $.FiniteNumber])
  (exponent => base => Math.pow (base, exponent));
