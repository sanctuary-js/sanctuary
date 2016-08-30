
import { $Maybe, Accessible, TypeRep } from '../_internal/Types'
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import R from 'ramda'
import { get } from '../Object'

//# pluck :: Accessible a => TypeRep b -> String -> Array a -> Array (Maybe b)
//.
//. Takes a [type representative](#type-representatives), a property name,
//. and an array of objects and returns an array of equal length. Each
//. element of the output array is Just the value of the specified property
//. of the corresponding object if the value is of the specified type
//. (according to [`is`](#is)); Nothing otherwise.
//.
//. See also [`get`](#get).
//.
//. ```javascript
//. > S.pluck(Number, 'x', [{x: 1}, {x: 2}, {x: '3'}, {x: null}, {}])
//. [Just(1), Just(2), Nothing, Nothing, Nothing]
//. ```
export const pluck =
def('pluck',
    {a: [Accessible]},
    [TypeRep, $.String, $.Array(a), $.Array($Maybe(b))],
    function(type, key, xs) { return R.map(get(type, key), xs); });
