
import { $Maybe, ArrayLike } from '../_internal/Types'
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import { Just } from '../Maybe'
import R from 'ramda'

var _ = R.__;

const sanctifyIndexOf = function(name) {
  return def(name,
             {b: [ArrayLike]},
             [a, b, $Maybe($.Integer)],
             R.pipe(R[name], Just, R.filter(R.gte(_, 0))));
};

//# indexOf :: a -> [a] -> Maybe Integer
//.
//. Takes a value of any type and a list, and returns Just the index
//. of the first occurrence of the value in the list, if applicable;
//. Nothing otherwise.
//.
//. Dispatches to its second argument's `indexOf` method if present.
//. As a result, `String -> String -> Maybe Integer` is an alternative
//. type signature.
//.
//. ```javascript
//. > S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
//. Just(1)
//.
//. > S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
//. Nothing
//.
//. > S.indexOf('an', 'banana')
//. Just(1)
//.
//. > S.indexOf('ax', 'banana')
//. Nothing
//. ```
export const indexOf = sanctifyIndexOf('indexOf');

//# lastIndexOf :: a -> [a] -> Maybe Integer
//.
//. Takes a value of any type and a list, and returns Just the index
//. of the last occurrence of the value in the list, if applicable;
//. Nothing otherwise.
//.
//. Dispatches to its second argument's `lastIndexOf` method if present.
//. As a result, `String -> String -> Maybe Integer` is an alternative
//. type signature.
//.
//. ```javascript
//. > S.lastIndexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
//. Just(5)
//.
//. > S.lastIndexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
//. Nothing
//.
//. > S.lastIndexOf('an', 'banana')
//. Just(3)
//.
//. > S.lastIndexOf('ax', 'banana')
//. Nothing
//. ```
export const lastIndexOf = sanctifyIndexOf('lastIndexOf');
