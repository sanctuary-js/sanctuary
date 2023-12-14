//# empty :: Monoid a => TypeRep a -> a
//.
//. [Type-safe][sanctuary-def] version of [`Z.empty`][].
//.
//. ```javascript
//. > S.empty (String)
//. ''
//.
//. > S.empty (Array)
//. []
//.
//. > S.empty (Object)
//. {}
//.
//. > S.empty (Sum)
//. Sum (0)
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import TypeRep from './internal/TypeRep.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a} = makeTypeVars ({a: 0});

export default def
  ('empty')
  ({a: [Z.Monoid]})
  ([TypeRep (a), a])
  (Z.empty);
