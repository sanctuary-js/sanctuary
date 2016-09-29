
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import R from 'ramda'
import { justs } from './justs'

//# mapMaybe :: (a -> Maybe b) -> Array a -> Array b
//.
//. Takes a function and an array, applies the function to each element of
//. the array, and returns an array of "successful" results. If the result of
//. applying the function to an element of the array is Nothing, the result
//. is discarded; if the result is a Just, the Just's value is included in
//. the output array.
//.
//. In general terms, `mapMaybe` filters an array while mapping over it.
//.
//. ```javascript
//. > S.mapMaybe(S.head, [[], [1, 2, 3], [], [4, 5, 6], []])
//. [1, 4]
//. ```
export const mapMaybe =
def('mapMaybe',
    {},
    [$.Function, $.Array(a), $.Array(b)],
    function(f, xs) { return justs(R.map(f, xs)); });
