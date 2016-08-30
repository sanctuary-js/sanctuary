
import { $Maybe, Applicative, Semigroup } from '../_internal/Types'
import { _type, a, b, def, filter, inspect, method, prop, sentinel } from '../_internal'
import $ from 'sanctuary-def'
// import { Just } from './Just'
// import { Nothing } from './Nothing'
import R from 'ramda'

//# Maybe :: TypeRep Maybe
//.
//. The [type representative](#type-representatives) for the Maybe type.
export function Maybe(x, box) {
  if (x !== sentinel) throw new Error('Cannot instantiate Maybe');
  var isJust = box.length > 0;
  if (isJust) this.value = box[0];
  this.isNothing = !isJust;
  this.isJust = isJust;
};

//# Maybe.empty :: -> Maybe a
//.
//. Returns Nothing.
//.
//. ```javascript
//. > S.Maybe.empty()
//. Nothing
//. ```
Maybe.empty =
def('Maybe.empty',
    {},
    [$Maybe(a)],
    function() { return Nothing; });

//# Maybe.of :: a -> Maybe a
//.
//. Takes a value of any type and returns a Just with the given value.
//.
//. ```javascript
//. > S.Maybe.of(42)
//. Just(42)
//. ```
Maybe.of =
def('Maybe.of',
    {},
    [a, $Maybe(a)],
    function(x) { return Just(x); });

//# Maybe#@@type :: String
//.
//. Maybe type identifier, `'sanctuary/Maybe'`.
Maybe.prototype['@@type'] = 'sanctuary/Maybe';

//# Maybe#isNothing :: Boolean
//.
//. `true` if `this` is Nothing; `false` if `this` is a Just.
//.
//. ```javascript
//. > S.Nothing.isNothing
//. true
//.
//. > S.Just(42).isNothing
//. false
//. ```

//# Maybe#isJust :: Boolean
//.
//. `true` if `this` is a Just; `false` if `this` is Nothing.
//.
//. ```javascript
//. > S.Just(42).isJust
//. true
//.
//. > S.Nothing.isJust
//. false
//. ```

//# Maybe#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
//.
//. Takes a value of type `Maybe a` and returns Nothing unless `this`
//. is a Just *and* the argument is a Just, in which case it returns a
//. Just whose value is the result of of applying this Just's value to
//. the given Just's value.
//.
//. ```javascript
//. > S.Nothing.ap(S.Just(42))
//. Nothing
//.
//. > S.Just(S.inc).ap(S.Nothing)
//. Nothing
//.
//. > S.Just(S.inc).ap(S.Just(42))
//. Just(43)
//. ```
Maybe.prototype.ap =
method('Maybe#ap',
       {},
       [$Maybe($.Function), $Maybe(a), $Maybe(b)],
       function(mf, mx) { return mf.isJust ? mx.map(mf.value) : mf; });

//# Maybe#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
//.
//. Takes a function and returns `this` if `this` is Nothing; otherwise
//. it returns the result of applying the function to this Just's value.
//.
//. ```javascript
//. > S.Nothing.chain(S.parseFloat)
//. Nothing
//.
//. > S.Just('xxx').chain(S.parseFloat)
//. Nothing
//.
//. > S.Just('12.34').chain(S.parseFloat)
//. Just(12.34)
//. ```
Maybe.prototype.chain =
method('Maybe#chain',
       {},
       [$Maybe(a), $.Function, $Maybe(b)],
       function(maybe, f) { return maybe.isJust ? f(maybe.value) : maybe; });

//# Maybe#concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a
//.
//. Returns the result of concatenating two Maybe values of the same type.
//. `a` must have a [Semigroup][] (indicated by the presence of a `concat`
//. method).
//.
//. If `this` is Nothing and the argument is Nothing, this method returns
//. Nothing.
//.
//. If `this` is a Just and the argument is a Just, this method returns a
//. Just whose value is the result of concatenating this Just's value and
//. the given Just's value.
//.
//. Otherwise, this method returns the Just.
//.
//. ```javascript
//. > S.Nothing.concat(S.Nothing)
//. Nothing
//.
//. > S.Just([1, 2, 3]).concat(S.Just([4, 5, 6]))
//. Just([1, 2, 3, 4, 5, 6])
//.
//. > S.Nothing.concat(S.Just([1, 2, 3]))
//. Just([1, 2, 3])
//.
//. > S.Just([1, 2, 3]).concat(S.Nothing)
//. Just([1, 2, 3])
//. ```
Maybe.prototype.concat =
method('Maybe#concat',
       {a: [Semigroup]},
       [$Maybe(a), $Maybe(a), $Maybe(a)],
       function(mx, my) {
         return mx.isNothing ? my :
                my.isNothing ? mx : Just(mx.value.concat(my.value));
       });

//# Maybe#empty :: Maybe a ~> Maybe a
//.
//. Returns Nothing.
//.
//. ```javascript
//. > S.Just(42).empty()
//. Nothing
//. ```
Maybe.prototype.empty =
def('Maybe#empty',
    {},
    [$Maybe(a)],
    Maybe.empty);

//# Maybe#equals :: Maybe a ~> b -> Boolean
//.
//. Takes a value of any type and returns `true` if:
//.
//.   - it is Nothing and `this` is Nothing; or
//.
//.   - it is a Just and `this` is a Just, and their values are equal
//.     according to [`R.equals`][R.equals].
//.
//. ```javascript
//. > S.Nothing.equals(S.Nothing)
//. true
//.
//. > S.Nothing.equals(null)
//. false
//.
//. > S.Just([1, 2, 3]).equals(S.Just([1, 2, 3]))
//. true
//.
//. > S.Just([1, 2, 3]).equals(S.Just([3, 2, 1]))
//. false
//.
//. > S.Just([1, 2, 3]).equals(S.Nothing)
//. false
//. ```
Maybe.prototype.equals =
method('Maybe#equals',
       {},
       [$Maybe(a), b, $.Boolean],
       function(maybe, x) {
         return _type(x) === 'sanctuary/Maybe' &&
                (maybe.isNothing && x.isNothing ||
                 maybe.isJust && x.isJust && R.eqProps('value', maybe, x));
       });

//# Maybe#extend :: Maybe a ~> (Maybe a -> a) -> Maybe a
//.
//. Takes a function and returns `this` if `this` is Nothing; otherwise
//. it returns a Just whose value is the result of applying the function
//. to `this`.
//.
//. ```javascript
//. > S.Nothing.extend(x => x.value + 1)
//. Nothing
//.
//. > S.Just(42).extend(x => x.value + 1)
//. Just(43)
//. ```
Maybe.prototype.extend =
method('Maybe#extend',
       {},
       [$Maybe(a), $.Function, $Maybe(a)],
       function(maybe, f) { return maybe.isJust ? Just(f(maybe)) : maybe; });

//# Maybe#filter :: Maybe a ~> (a -> Boolean) -> Maybe a
//.
//. Takes a predicate and returns `this` if `this` is a Just whose value
//. satisfies the predicate; Nothing otherwise.
//.
//. ```javascript
//. > S.Just(42).filter(n => n % 2 === 0)
//. Just(42)
//.
//. > S.Just(43).filter(n => n % 2 === 0)
//. Nothing
//. ```
Maybe.prototype.filter =
method('Maybe#filter',
       {},
       [$Maybe(a), $.Function, $Maybe(a)],
       function(maybe, pred) { return filter(pred, maybe); });

//# Maybe#map :: Maybe a ~> (a -> b) -> Maybe b
//.
//. Takes a function and returns `this` if `this` is Nothing; otherwise
//. it returns a Just whose value is the result of applying the function
//. to this Just's value.
//.
//. ```javascript
//. > S.Nothing.map(S.inc)
//. Nothing
//.
//. > S.Just([1, 2, 3]).map(S.sum)
//. Just(6)
//. ```
Maybe.prototype.map =
method('Maybe#map',
       {},
       [$Maybe(a), $.Function, $Maybe(b)],
       function(maybe, f) {
         return maybe.isJust ? Just(f(maybe.value)) : maybe;
       });

//# Maybe#of :: Maybe a ~> b -> Maybe b
//.
//. Takes a value of any type and returns a Just with the given value.
//.
//. ```javascript
//. > S.Nothing.of(42)
//. Just(42)
//. ```
Maybe.prototype.of =
def('Maybe#of',
    {},
    [b, $Maybe(b)],
    Maybe.of);

//# Maybe#reduce :: Maybe a ~> ((b, a) -> b) -> b -> b
//.
//. Takes a function and an initial value of any type, and returns:
//.
//.   - the initial value if `this` is Nothing; otherwise
//.
//.   - the result of applying the function to the initial value and this
//.     Just's value.
//.
//. ```javascript
//. > S.Nothing.reduce(S.add, 10)
//. 10
//.
//. > S.Just(5).reduce(S.add, 10)
//. 15
//. ```
Maybe.prototype.reduce =
method('Maybe#reduce',
       {},
       [$Maybe(a), $.Function, b, b],
       function(maybe, f, x) {
         return maybe.isJust ? f(x, maybe.value) : x;
       });

//# Maybe#sequence :: Applicative f => Maybe (f a) ~> (a -> f a) -> f (Maybe a)
//.
//. Evaluates an applicative action contained within the Maybe, resulting in:
//.
//.   - a pure applicative of Nothing if `this` is Nothing; otherwise
//.
//.   - an applicative of Just the value of the evaluated action.
//.
//. ```javascript
//. > S.Nothing.sequence(S.Either.of)
//. Right(Nothing)
//.
//. > S.Just(S.Right(42)).sequence(S.Either.of)
//. Right(Just(42))
//.
//. > S.Just(S.Left('Cannot divide by zero')).sequence(S.Either.of)
//. Left('Cannot divide by zero')
//. ```
Maybe.prototype.sequence =
method('Maybe#sequence',
       {a: [Applicative], b: [Applicative]},
       [$Maybe(a), $.Function, b],
       function(maybe, of) {
         return maybe.isJust ? R.map(Just, maybe.value) : of(maybe);
       });

//# Maybe#toBoolean :: Maybe a ~> Boolean
//.
//. Returns `false` if `this` is Nothing; `true` if `this` is a Just.
//.
//. ```javascript
//. > S.Nothing.toBoolean()
//. false
//.
//. > S.Just(42).toBoolean()
//. true
//. ```
Maybe.prototype.toBoolean =
method('Maybe#toBoolean',
       {},
       [$Maybe(a), $.Boolean],
       prop('isJust'));

//# Maybe#toString :: Maybe a ~> String
//.
//. Returns the string representation of the Maybe.
//.
//. ```javascript
//. > S.Nothing.toString()
//. 'Nothing'
//.
//. > S.Just([1, 2, 3]).toString()
//. 'Just([1, 2, 3])'
//. ```
Maybe.prototype.toString =
method('Maybe#toString',
       {},
       [$Maybe(a), $.String],
       function(maybe) {
         return maybe.isJust ? 'Just(' + R.toString(maybe.value) + ')'
                             : 'Nothing';
       });

//# Maybe#inspect :: Maybe a ~> String
//.
//. Returns the string representation of the Maybe. This method is used by
//. `util.inspect` and the REPL to format a Maybe for display.
//.
//. See also [`Maybe#toString`](#Maybe.prototype.toString).
//.
//. ```javascript
//. > S.Nothing.inspect()
//. 'Nothing'
//.
//. > S.Just([1, 2, 3]).inspect()
//. 'Just([1, 2, 3])'
//. ```
Maybe.prototype.inspect = inspect;

//# Just :: a -> Maybe a
//.
//. Takes a value of any type and returns a Just with the given value.
//.
//. ```javascript
//. > S.Just(42)
//. Just(42)
//. ```
export const Just = function(value) { return new Maybe(sentinel, [value]); };

//# Nothing :: Maybe a
//.
//. Nothing.
//.
//. ```javascript
//. > S.Nothing
//. Nothing
//. ```
export const Nothing = new Maybe(sentinel, []);
