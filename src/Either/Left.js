
import { Either } from './Either'
import { sentinel } from '../_internal'

//# Left :: a -> Either a b
//.
//. Takes a value of any type and returns a Left with the given value.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero')
//. Left('Cannot divide by zero')
//. ```
export const Left = function(value) {
  var left = new Either(sentinel);
  left.isLeft = true;
  left.isRight = false;
  left.value = value;
  return left;
};
