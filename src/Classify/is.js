
import $ from 'sanctuary-def'
import R from 'ramda'
import { TypeRep } from '../_internal/Types'
import { def } from '../_internal'

//# is :: TypeRep a -> b -> Boolean
//.
//. Takes a [type representative](#type-representatives) and a value of
//. any type and returns `true` if the given value is of the specified
//. type; `false` otherwise. Subtyping is not respected.
//.
//. ```javascript
//. > S.is(Number, 42)
//. true
//.
//. > S.is(Object, 42)
//. false
//.
//. > S.is(String, 42)
//. false
//. ```
export const is =
def('is',
    {},
    [TypeRep, $.Any, $.Boolean],
    function(type, x) {
      return x != null && (
        R.type(type.prototype['@@type']) === 'String' ?
          x['@@type'] === type.prototype['@@type'] :
          R.type(x) === R.nth(1, R.match(/function (\w*)/, String(type)))
      );
    });
