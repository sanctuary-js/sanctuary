//# zero :: Plus f => TypeRep f -> f a
//.
//. [Type-safe][sanctuary-def] version of [`Z.zero`][].
//.
//. ```javascript
//. > S.zero (Array)
//. []
//.
//. > S.zero (Object)
//. {}
//.
//. > S.zero (S.Maybe)
//. Nothing
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import TypeRep from './internal/TypeRep.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('zero')
  ({f: [Z.Plus]})
  ([TypeRep (f (a)), f (a)])
  (Z.zero);
