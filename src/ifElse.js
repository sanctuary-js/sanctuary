//# ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b
//.
//. Takes a unary predicate, a unary "if" function, a unary "else"
//. function, and a value of any type, and returns the result of
//. applying the "if" function to the value if the value satisfies
//. the predicate; the result of applying the "else" function to the
//. value otherwise.
//.
//. See also [`when`](#when) and [`unless`](#unless).
//.
//. ```javascript
//. > S.ifElse (x => x < 0) (Math.abs) (Math.sqrt) (-1)
//. 1
//.
//. > S.ifElse (x => x < 0) (Math.abs) (Math.sqrt) (16)
//. 4
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('ifElse')
  ({})
  ([$.Predicate (a), $.Fn (a) (b), $.Fn (a) (b), a, b])
  (pred => f => g => x => pred (x) ? f (x) : g (x));
