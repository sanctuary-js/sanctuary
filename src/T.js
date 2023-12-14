//# T :: a -> (a -> b) -> b
//.
//. The T ([thrush][]) combinator. Takes a value and a function, and returns
//. the result of applying the function to the value. Equivalent to Haskell's
//. `(&)` function.
//.
//. ```javascript
//. > S.T (42) (S.add (1))
//. 43
//.
//. > S.map (S.T (100)) ([S.add (1), Math.sqrt])
//. [101, 10]
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default
def ('T')
    ({})
    ([a, $.Fn (a) (b), b])
    (x => f => f (x));
