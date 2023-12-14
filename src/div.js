//# div :: NonZeroFiniteNumber -> FiniteNumber -> FiniteNumber
//.
//. Takes a non-zero finite number `n` and returns the _divide by `n`_
//. function.
//.
//. ```javascript
//. > S.map (S.div (2)) ([0, 1, 2, 3])
//. [0, 0.5, 1, 1.5]
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default def
  ('div')
  ({})
  ([$.NonZeroFiniteNumber, $.FiniteNumber, $.FiniteNumber])
  (y => x => x / y);
