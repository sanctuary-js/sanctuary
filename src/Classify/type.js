
import { _type, def } from '../_internal'
import $ from 'sanctuary-def'

//# type :: a -> String
//.
//. Takes a value, `x`, of any type and returns its type identifier. If
//. `x` has a `'@@type'` property whose value is a string, `x['@@type']`
//. is the type identifier. Otherwise, the type identifier is the result
//. of applying [`R.type`][R.type] to `x`.
//.
//. `'@@type'` properties should use the form `'<package-name>/<type-name>'`,
//. where `<package-name>` is the name of the npm package in which the type
//. is defined.
//.
//. ```javascript
//. > S.type(S.Just(42))
//. 'sanctuary/Maybe'
//.
//. > S.type([1, 2, 3])
//. 'Array'
//. ```
export const type =
def('type',
    {},
    [$.Any, $.String],
    _type);
