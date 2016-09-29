
import { Left, Right } from './Either'
import { a, def, l, r } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'

//# encaseEither :: (Error -> l) -> (a -> r) -> a -> Either l r
//.
//. Takes two unary functions, `f` and `g`, the second of which may throw,
//. and a value `x` of any type. Applies `g` to `x` inside a `try` block.
//. If an exception is caught, the return value is a Left containing the
//. result of applying `f` to the caught Error object; otherwise the return
//. value is a Right containing the result of applying `g` to `x`.
//.
//. See also [`encase`](#encase).
//.
//. ```javascript
//. > S.encaseEither(S.I, JSON.parse, '["foo","bar","baz"]')
//. Right(['foo', 'bar', 'baz'])
//.
//. > S.encaseEither(S.I, JSON.parse, '[')
//. Left(new SyntaxError('Unexpected end of input'))
//.
//. > S.encaseEither(S.prop('message'), JSON.parse, '[')
//. Left('Unexpected end of input')
//. ```
export const encaseEither =
def('encaseEither',
    {},
    [$.Function, $.Function, a, $Either(l, r)],
    function(f, g, x) {
      try {
        return Right(g(x));
      } catch (err) {
        return Left(f(err));
      }
    });
