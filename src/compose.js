//# compose :: Semigroupoid s => s b c -> s a b -> s a c
//.
//. Curried version of [`Z.compose`][].
//.
//. When specialized to Function, `compose` composes two unary functions,
//. from right to left (this is the B combinator from combinatory logic).
//.
//. The generalized type signature indicates that `compose` is compatible
//. with any [Semigroupoid][].
//.
//. See also [`pipe`](#pipe).
//.
//. ```javascript
//. > S.compose (Math.sqrt) (S.add (1)) (99)
//. 10
//. ```

import Z from 'sanctuary-type-classes';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c, s} = makeTypeVars ({a: 0, b: 0, c: 0, s: 2});

export default def
  ('compose')
  ({s: [Z.Semigroupoid]})
  ([s (b) (c), s (a) (b), s (a) (c)])
  (x => y => Z.compose (x, y));
