//# add :: FiniteNumber -> FiniteNumber -> FiniteNumber
//.
//. Returns the sum of two (finite) numbers.
//.
//. ```javascript
//. > S.add (1) (1)
//. 2
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';

export default
def ('add')
    ({})
    ([$.FiniteNumber, $.FiniteNumber, $.FiniteNumber])
    (x => y => x + y);
