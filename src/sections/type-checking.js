//. ## <span id="section:type-checking">❑ Type checking</span>
//.
//. Sanctuary functions are defined via [sanctuary-def][] to provide run-time
//. type checking. This is tremendously useful during development: type errors
//. are reported immediately, avoiding circuitous stack traces (at best) and
//. silent failures due to type coercion (at worst). For example:
//.
//. ```javascript
//. S.add (2) (true);
//. // ! TypeError: Invalid value
//. //
//. //   add :: FiniteNumber -> FiniteNumber -> FiniteNumber
//. //                          ^^^^^^^^^^^^
//. //                               1
//. //
//. //   1)  true :: Boolean
//. //
//. //   The value at position 1 is not a member of ‘FiniteNumber’.
//. //
//. //   See v:sanctuary-js/sanctuary-def#FiniteNumber for information about the FiniteNumber type.
//. ```
//.
//. Compare this to the behaviour of Ramda's unchecked equivalent:
//.
//. ```javascript
//. R.add (2) (true);
//. // => 3
//. ```
//.
//. There is a performance cost to run-time type checking. Type checking is
//. disabled by default if `process.env.NODE_ENV` is `'production'`. If this
//. rule is unsuitable for a given program, one may use [`create`](#create)
//. to create a Sanctuary module based on a different rule. For example:
//.
//. ```javascript
//. const S = sanctuary.create ({
//.   checkTypes: localStorage.getItem ('SANCTUARY_CHECK_TYPES') === 'true',
//.   env: sanctuary.env,
//. });
//. ```
//.
//. Occasionally one may wish to perform an operation that is not type safe,
//. such as mapping over an object with heterogeneous values. This is possible
//. via selective use of [`unchecked`](#unchecked) functions.
