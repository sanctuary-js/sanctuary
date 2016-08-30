
import { prop as _prop } from '../_internal'

//# prop :: Accessible a => String -> a -> b
//.
//. Takes a property name and an object with known properties and returns
//. the value of the specified property. If for some reason the object
//. lacks the specified property, a type error is thrown.
//.
//. For accessing properties of uncertain objects, use [`get`](#get) instead.
//.
//. ```javascript
//. > S.prop('a', {a: 1, b: 2})
//. 1
//. ```
export const prop = _prop
