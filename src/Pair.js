//# Pair :: a -> b -> Pair a b
//.
//. Pair's sole data constructor. Additionally, it serves as the
//. Pair [type representative][].
//.
//. ```javascript
//. > S.Pair ('foo') (42)
//. Pair ('foo') (42)
//. ```

import $ from 'sanctuary-def';
import Pair_ from 'sanctuary-pair';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default
def ('Pair')
    ({})
    ([a, b, $.Pair (a) (b)])
    (Pair_);
