
import { Left, Right } from './Either'
import { a, b, c, def, l, r } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'

//# encaseEither3 :: (Error -> l) -> (a -> b -> c -> r) -> a -> b -> c -> Either l r
//.
//. Ternary version of [`encaseEither`](#encaseEither).
//.
//. See also [`encaseEither3_`](#encaseEither3_).
export const encaseEither3 =
def('encaseEither3',
    {},
    [$.Function, $.Function, a, b, c, $Either(l, r)],
    function(f, g, x, y, z) {
      try {
        return Right(g(x)(y)(z));
      } catch (err) {
        return Left(f(err));
      }
    });
