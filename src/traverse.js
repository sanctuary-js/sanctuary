//# traverse :: (Applicative f, Traversable t) => TypeRep f -> (a -> f b) -> t a -> f (t b)
//.
//. Curried version of [`Z.traverse`][].
//.
//. ```javascript
//. > S.traverse (Array) (S.words) (S.Just ('foo bar baz'))
//. [Just ('foo'), Just ('bar'), Just ('baz')]
//.
//. > S.traverse (Array) (S.words) (S.Nothing)
//. [Nothing]
//.
//. > S.traverse (S.Maybe) (S.parseInt (16)) (['A', 'B', 'C'])
//. Just ([10, 11, 12])
//.
//. > S.traverse (S.Maybe) (S.parseInt (16)) (['A', 'B', 'C', 'X'])
//. Nothing
//.
//. > S.traverse (S.Maybe) (S.parseInt (16)) ({a: 'A', b: 'B', c: 'C'})
//. Just ({a: 10, b: 11, c: 12})
//.
//. > S.traverse (S.Maybe) (S.parseInt (16)) ({a: 'A', b: 'B', c: 'C', x: 'X'})
//. Nothing
//. ```

import $ from 'sanctuary-def';
import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import TypeRep from './internal/TypeRep.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, f, t} = makeTypeVars ({a: 0, b: 0, f: 1, t: 1});

export default def
  ('traverse')
  ({f: [Z.Applicative], t: [Z.Traversable]})
  ([TypeRep (f (b)), $.Fn (a) (f (b)), t (a), f (t (b))])
  (typeRep => f => traversable => Z.traverse (typeRep, f, traversable));
