//# id :: Category c => TypeRep c -> c
//.
//. [Type-safe][sanctuary-def] version of [`Z.id`][].
//.
//. ```javascript
//. > S.id (Function) (42)
//. 42
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import TypeRep from './internal/TypeRep.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {c} = makeTypeVars ({c: 0});

export default def
  ('id')
  ({c: [Z.Category]})
  ([TypeRep (c), c])
  (Z.id);
