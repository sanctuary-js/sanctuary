
import { $Maybe, Accessible, TypeRep } from '../_internal/Types'
import { a, b, def, filter } from '../_internal'
import $ from 'sanctuary-def'
import { Just } from '../Maybe'
import { is } from '../Classify'

//# get :: Accessible a => TypeRep b -> String -> a -> Maybe b
//.
//. Takes a [type representative](#type-representatives), a property
//. name, and an object and returns Just the value of the specified object
//. property if it is of the specified type (according to [`is`](#is));
//. Nothing otherwise.
//.
//. The `Object` type representative may be used as a catch-all since most
//. values have `Object.prototype` in their prototype chains.
//.
//. See also [`gets`](#gets) and [`prop`](#prop).
//.
//. ```javascript
//. > S.get(Number, 'x', {x: 1, y: 2})
//. Just(1)
//.
//. > S.get(Number, 'x', {x: '1', y: '2'})
//. Nothing
//.
//. > S.get(Number, 'x', {})
//. Nothing
//. ```
export const get =
def('get',
    {a: [Accessible]},
    [TypeRep, $.String, a, $Maybe(b)],
    function(type, key, obj) { return filter(is(type), Just(obj[key])); });
