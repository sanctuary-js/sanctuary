//# on :: (b -> b -> c) -> (a -> b) -> a -> a -> c
//.
//. Takes a binary function `f`, a unary function `g`, and two
//. values `x` and `y`. Returns `f (g (x)) (g (y))`.
//.
//. This is the P combinator from combinatory logic.
//.
//. ```javascript
//. > S.on (S.concat) (S.reverse) ([1, 2, 3]) ([4, 5, 6])
//. [3, 2, 1, 6, 5, 4]
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c} = makeTypeVars ({a: 0, b: 0, c: 0});

export default def
  ('on')
  ({})
  ([$.Fn (b) ($.Fn (b) (c)), $.Fn (a) (b), a, a, c])
  (f => g => x => y => f (g (x)) (g (y)));
