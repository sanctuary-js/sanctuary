//# fromRight :: b -> Either a b -> b
//.
//. Takes a default value and an Either, and returns the Right value
//. if the Either is a Right; the default value otherwise.
//.
//. See also [`either`](#either) and [`fromLeft`](#fromLeft).
//.
//. ```javascript
//. > S.fromRight (123) (S.Right (789))
//. 789
//.
//. > S.fromRight (123) (S.Left ('abc'))
//. 123
//. ```

import $ from 'sanctuary-def';

import def from './internal/def.js';
import makeTypeVars from './internal/makeTypeVars.js';

const {a, b} = makeTypeVars ({a: 0, b: 0});

export default def
  ('fromRight')
  ({})
  ([b, $.Either (a) (b), b])
  (left => either => either.isRight ? either.value : left);
