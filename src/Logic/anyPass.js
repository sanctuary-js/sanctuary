
import { a, def } from '../_internal'
import $ from 'sanctuary-def'

//# anyPass :: Array (a -> Boolean) -> a -> Boolean
//.
//. Takes an array of unary predicates and a value of any type
//. and returns `true` if any of the predicates pass; `false` otherwise.
//. None of the subsequent predicates will be evaluated after the
//. first passed predicate.
//.
//. ```javascript
//. > S.anyPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'incandescent')
//. true
//.
//. > S.anyPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'empathy')
//. false
//. ```
export const anyPass =
def('anyPass',
    {},
    [$.Array($.Function), a, $.Boolean],
    function(preds, x) {
      for (var idx = 0; idx < preds.length; idx += 1) {
        if (preds[idx](x)) return true;
      }
      return false;
    });
