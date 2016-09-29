
import { Just, Nothing } from './Maybe'
import { a, b, def } from '../_internal'
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'

//# encase :: (a -> b) -> a -> Maybe b
//.
//. Takes a unary function `f` which may throw and a value `x` of any type,
//. and applies `f` to `x` inside a `try` block. If an exception is caught,
//. the return value is Nothing; otherwise the return value is Just the
//. result of applying `f` to `x`.
//.
//. See also [`encaseEither`](#encaseEither).
//.
//. ```javascript
//. > S.encase(eval, '1 + 1')
//. Just(2)
//.
//. > S.encase(eval, '1 +')
//. Nothing
//. ```
export const encase =
def('encase',
    {},
    [$.Function, a, $Maybe(b)],
    function(f, x) {
      try {
        return Just(f(x));
      } catch (err) {
        return Nothing;
      }
    });
