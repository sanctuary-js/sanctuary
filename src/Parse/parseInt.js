
import $ from 'sanctuary-def'
import { $Maybe } from '../_internal/Types'
import { I } from '../Combinator'
import { Just } from '../Maybe'
import R from 'ramda'
import { def } from '../_internal'
import { toUpper } from '../String'

var _ = R.__;

//# parseInt :: Integer -> String -> Maybe Integer
//.
//. Takes a radix (an integer between 2 and 36 inclusive) and a string,
//. and returns Just the number represented by the string if it does in
//. fact represent a number in the base specified by the radix; Nothing
//. otherwise.
//.
//. This function is stricter than [`parseInt`][parseInt]: a string
//. is considered to represent an integer only if all its non-prefix
//. characters are members of the character set specified by the radix.
//.
//. ```javascript
//. > S.parseInt(10, '-42')
//. Just(-42)
//.
//. > S.parseInt(16, '0xFF')
//. Just(255)
//.
//. > S.parseInt(16, '0xGG')
//. Nothing
//. ```
export const _parseInt =
def('parseInt',
    {},
    [$.Integer, $.String, $Maybe($.Integer)],
    function(radix, s) {
      if (radix < 2 || radix > 36) {
        throw new RangeError('Radix not in [2 .. 36]');
      }

      var charset = R.take(radix, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

      return R.pipe(
        Just,
        R.filter(R.pipe(R.replace(/^[+-]/, ''),
                        radix === 16 ? R.replace(/^0x/i, '') : I,
                        R.split(''),
                        R.all(R.pipe(toUpper,
                                     R.indexOf(_, charset),
                                     R.gte(_, 0))))),
        R.map(R.partialRight(parseInt, [radix])),
        R.filter($.Integer._test)
      )(s);
    });
