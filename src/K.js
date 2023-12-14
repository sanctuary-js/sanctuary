//# K :: a -> b -> a
//.
//. The K combinator. Takes two values and returns the first. Equivalent to
//. Haskell's `const` function.
//.
//. ```javascript
//. > S.K ('foo') ('bar')
//. 'foo'
//.
//. > S.map (S.K (42)) (S.range (0) (5))
//. [42, 42, 42, 42, 42]
//. ```

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default
def ('K')
    ({})
    ([a, b, a])
    (x => y => x);
