
import { a, def } from '../_internal'
import $ from 'sanctuary-def'

//# allPass :: Array (a -> Boolean) -> a -> Boolean
//.
//. Takes an array of unary predicates and a value of any type
//. and returns `true` if all the predicates pass; `false` otherwise.
//. None of the subsequent predicates will be evaluated after the
//. first failed predicate.
//.
//. ```javascript
//. > S.allPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'quiessence')
//. true
//.
//. > S.allPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'fissiparous')
//. false
//. ```
export const allPass =
def('allPass',
    {},
    [$.Array($.Function), a, $.Boolean],
    function(preds, x) {
      for (var idx = 0; idx < preds.length; idx += 1) {
        if (!preds[idx](x)) return false;
      }
      return true;
    });
