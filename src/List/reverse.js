
import { _type, a, def } from '../_internal'
import { List } from '../_internal/Types'

//# reverse :: [a] -> [a]
//.
//. Returns the elements of the given list in reverse order.
//.
//. ```javascript
//. > S.reverse([1, 2, 3])
//. [3, 2, 1]
//.
//. > S.reverse('abc')
//. 'cba'
//. ```
export const reverse =
def('reverse',
    {},
    [List(a), List(a)],
    function reverse(xs) {
      if (_type(xs) === 'String') return reverse(xs.split('')).join('');
      var result = [];
      for (var idx = xs.length - 1; idx >= 0; idx -= 1) result.push(xs[idx]);
      return result;
    });
