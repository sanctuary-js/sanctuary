//# Just :: a -> Maybe a
//.
//. Constructs a value of type `Maybe a` from a value of type `a`.
//.
//. ```javascript
//. > S.Just (42)
//. Just (42)
//. ```

import $ from 'sanctuary-def';
import Maybe from 'sanctuary-maybe';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default
def ('Just')
    ({})
    ([a, $.Maybe (a)])
    (Maybe.Just);
