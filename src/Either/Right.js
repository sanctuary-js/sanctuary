
import { Either } from './Either'
import { sentinel } from '../_internal'

//# Right :: b -> Either a b
//.
//. Takes a value of any type and returns a Right with the given value.
//.
//. ```javascript
//. > S.Right(42)
//. Right(42)
//. ```
export const Right = function(value) {
  var right = new Either(sentinel);
  right.isLeft = false;
  right.isRight = true;
  right.value = value;
  return right;
};
