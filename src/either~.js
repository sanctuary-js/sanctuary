//# either :: (a -> c) -> (b -> c) -> Either a b -> c
//.
//. Takes two functions and an Either, and returns the result of
//. applying the first function to the Left's value, if the Either
//. is a Left, or the result of applying the second function to the
//. Right's value, if the Either is a Right.
//.
//. See also [`fromLeft`](#fromLeft) and [`fromRight`](#fromRight).
//.
//. ```javascript
//. > S.either (S.toUpper) (S.show) (S.Left ('Cannot divide by zero'))
//. 'CANNOT DIVIDE BY ZERO'
//.
//. > S.either (S.toUpper) (S.show) (S.Right (42))
//. '42'
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b, c} = makeTypeVars ({a: 0, b: 0, c: 0});

export default def
  ('either')
  ({})
  ([$.Fn (a) (c), $.Fn (b) (c), $.Either (a) (b), c])
  (left => right => either =>
     either.isLeft ? left (either.value) : right (either.value));
