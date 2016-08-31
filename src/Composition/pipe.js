
import { a, b, compose2, def } from '../_internal'
import $ from 'sanctuary-def'
import { I } from '../Combinator'
import R from 'ramda'

//# pipe :: [(a -> b), (b -> c), ..., (m -> n)] -> a -> n
//.
//. Takes an array of functions assumed to be unary and a value of any type,
//. and returns the result of applying the sequence of transformations to
//. the initial value.
//.
//. In general terms, `pipe` performs left-to-right composition of an array
//. of functions. `pipe([f, g, h], x)` is equivalent to `h(g(f(x)))`.
//.
//. See also [`meld`](#meld).
//.
//. ```javascript
//. > S.pipe([S.inc, Math.sqrt, S.dec])(99)
//. 9
//. ```
export const pipe =
def('pipe',
    {},
    [$.Array($.Function), a, b],
    function(fs, x) { return R.reduceRight(compose2, I, fs)(x); });
