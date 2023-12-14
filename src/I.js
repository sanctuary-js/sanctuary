//# I :: a -> a
//.
//. The I combinator. Returns its argument. Equivalent to Haskell's `id`
//. function.
//.
//. ```javascript
//. > S.I ('foo')
//. 'foo'
//. ```

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default
def ('I')
    ({})
    ([a, a])
    (x => x);
