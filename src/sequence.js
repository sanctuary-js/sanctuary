//# sequence :: (Applicative f, Traversable t) => TypeRep f -> t (f a) -> f (t a)
//.
//. Curried version of [`Z.sequence`][]. Inverts the given `t (f a)`
//. to produce an `f (t a)`.
//.
//. ```javascript
//. > S.sequence (Array) (S.Just ([1, 2, 3]))
//. [Just (1), Just (2), Just (3)]
//.
//. > S.sequence (S.Maybe) ([S.Just (1), S.Just (2), S.Just (3)])
//. Just ([1, 2, 3])
//.
//. > S.sequence (S.Maybe) ([S.Just (1), S.Just (2), S.Nothing])
//. Nothing
//.
//. > S.sequence (S.Maybe) ({a: S.Just (1), b: S.Just (2), c: S.Just (3)})
//. Just ({a: 1, b: 2, c: 3})
//.
//. > S.sequence (S.Maybe) ({a: S.Just (1), b: S.Just (2), c: S.Nothing})
//. Nothing
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';
import TypeRep from './internal/TypeRep.js';

const {a, f, t} = makeTypeVars ({a: 0, f: 1, t: 1});

export default def
  ('sequence')
  ({f: [Z.Applicative], t: [Z.Traversable]})
  ([TypeRep (f (a)), t (f (a)), f (t (a))])
  (typeRep => traversable => Z.sequence (typeRep, traversable));
