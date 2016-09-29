
import { $Maybe, Accessible, TypeRep } from '../_internal/Types'
import { Just, Nothing } from '../Maybe'
import { a, b, def, filter } from '../_internal'
import $ from 'sanctuary-def'
import { is } from '../Classify'

//# gets :: Accessible a => TypeRep b -> Array String -> a -> Maybe b
//.
//. Takes a [type representative](#type-representatives), an array of
//. property names, and an object and returns Just the value at the path
//. specified by the array of property names if such a path exists and
//. the value is of the specified type; Nothing otherwise.
//.
//. See also [`get`](#get).
//.
//. ```javascript
//. > S.gets(Number, ['a', 'b', 'c'], {a: {b: {c: 42}}})
//. Just(42)
//.
//. > S.gets(Number, ['a', 'b', 'c'], {a: {b: {c: '42'}}})
//. Nothing
//.
//. > S.gets(Number, ['a', 'b', 'c'], {})
//. Nothing
//. ```
export const gets =
def('gets',
    {a: [Accessible]},
    [TypeRep, $.Array($.String), a, $Maybe(b)],
    function(type, keys, obj) {
      var x = obj;
      for (var idx = 0; idx < keys.length; idx += 1) {
        if (x == null) return Nothing;
        x = x[keys[idx]];
      }
      return filter(is(type), Just(x));
    });
