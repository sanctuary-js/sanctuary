//# pair :: (a -> b -> c) -> Pair a b -> c
//.
//. Case analysis for the `Pair a b` type.
//.
//. ```javascript
//. > S.pair (S.concat) (S.Pair ('foo') ('bar'))
//. 'foobar'
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c} = makeTypeVars ({a: 0, b: 0, c: 0});

export default
def ('pair')
    ({})
    ([$.Fn (a) ($.Fn (b) (c)), $.Pair (a) (b), c])
    (pair => ([fst, snd]) => pair (fst) (snd));
