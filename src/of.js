//# of :: Applicative f => TypeRep f -> a -> f a
//.
//. Curried version of [`Z.of`][].
//.
//. ```javascript
//. > S.of (Array) (42)
//. [42]
//.
//. > S.of (Function) (42) (null)
//. 42
//.
//. > S.of (S.Maybe) (42)
//. Just (42)
//.
//. > S.of (S.Either) (42)
//. Right (42)
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import TypeRep from './internal/TypeRep.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, f} = makeTypeVars ({a: 0, f: 1});

export default def
  ('of')
  ({f: [Z.Applicative]})
  ([TypeRep (f (a)), a, f (a)])
  (typeRep => x => Z.of (typeRep, x));
