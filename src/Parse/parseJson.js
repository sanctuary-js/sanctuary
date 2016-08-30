
import { $Maybe, TypeRep } from '../_internal/Types'
import { a, def, filter } from '../_internal'
import $ from 'sanctuary-def'
import { encase } from '../Maybe'
import { is } from '../Classify'

//# parseJson :: TypeRep a -> String -> Maybe a
//.
//. Takes a [type representative](#type-representatives) and a string which
//. may or may not be valid JSON, and returns Just the result of applying
//. `JSON.parse` to the string *if* the result is of the specified type
//. (according to [`is`](#is)); Nothing otherwise.
//.
//. ```javascript
//. > S.parseJson(Array, '["foo","bar","baz"]')
//. Just(['foo', 'bar', 'baz'])
//.
//. > S.parseJson(Array, '[')
//. Nothing
//.
//. > S.parseJson(Object, '["foo","bar","baz"]')
//. Nothing
//. ```
export const parseJson =
def('parseJson',
    {},
    [TypeRep, $.String, $Maybe(a)],
    function(type, s) { return filter(is(type), encase(JSON.parse, s)); });
