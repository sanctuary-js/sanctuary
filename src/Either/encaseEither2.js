
import { Left, Right } from './Either'
import { a, b, def, l, r } from '../_internal'
import $ from 'sanctuary-def'
import { $Either } from '../_internal/Types'

//# encaseEither2 :: (Error -> l) -> (a -> b -> r) -> a -> b -> Either l r
//.
//. Binary version of [`encaseEither`](#encaseEither).
//.
//. See also [`encaseEither2_`](#encaseEither2_).
export const encaseEither2 =
def('encaseEither2',
    {},
    [$.Function, $.Function, a, b, $Either(l, r)],
    function(f, g, x, y) {
      try {
        return Right(g(x)(y));
      } catch (err) {
        return Left(f(err));
      }
    });
