
import R from 'ramda'
import $ from 'sanctuary-def'
import { def } from '../_internal'
import { sum } from '../Number'

//# meld :: [** -> *] -> (* -> * -> ... -> *)
//.
//. Takes an array of non-nullary functions and returns a curried function
//. whose arity is one greater than the sum of the arities of the given
//. functions less the number of functions.
//.
//. The behaviour of `meld` is best conveyed diagrammatically. The following
//. diagram depicts the "melding" of binary functions `f` and `g`:
//.
//.               +-------+
//.     --- a --->|       |
//.               |   f   |                +-------+
//.     --- b --->|       |--- f(a, b) --->|       |
//.               +-------+                |   g   |
//.     --- c ---------------------------->|       |--- g(f(a, b), c) --->
//.                                        +-------+
//.
//. See also [`pipe`](#pipe).
//.
//. ```javascript
//. > S.meld([Math.pow, S.sub])(3, 4, 5)
//. 76
//.
//. > S.meld([Math.pow, S.sub])(3)(4)(5)
//. 76
//. ```
export const meld =
def('meld',
    {},
    [$.Array($.Function), $.Function],
    function(fs) {
      var n = 1 + sum(R.map(R.length, fs)) - fs.length;
      return R.curryN(n, function() {
        var args = Array.prototype.slice.call(arguments);
        for (var idx = 0; idx < fs.length; idx += 1) {
          args.unshift(fs[idx].apply(this, args.splice(0, fs[idx].length)));
        }
        return args[0];
      });
    });
