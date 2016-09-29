
import { $Either, Applicative, Semigroup } from '../_internal/Types'
import { _type, a, b, c, def, inspect, method, prop, sentinel } from '../_internal'
import $ from 'sanctuary-def'
import R from 'ramda'

//. ### Either type

//. The Either type represents values with two possibilities: a value of type
//. `Either a b` is either a Left whose value is of type `a` or a Right whose
//. value is of type `b`.
//.
//. The Either type satisfies the [Semigroup][], [Monad][], [Traversable][],
//. and [Extend][] specifications.

//# EitherType :: Type -> Type -> Type
//.
//. A [`BinaryType`][BinaryType] for use with [sanctuary-def][].

//# Either :: TypeRep Either
//.
//. The [type representative](#type-representatives) for the Either type.
export const Either = function Either() {
  if (arguments[0] !== sentinel) {
    throw new Error('Cannot instantiate Either');
  }
};

//# Either.of :: b -> Either a b
//.
//. Takes a value of any type and returns a Right with the given value.
//.
//. ```javascript
//. > S.Either.of(42)
//. Right(42)
//. ```
Either.of =
def('Either.of',
    {},
    [b, $Either(a, b)],
    function(x) { return Right(x); });

//# Either#@@type :: String
//.
//. Either type identifier, `'sanctuary/Either'`.
Either.prototype['@@type'] = 'sanctuary/Either';

//# Either#isLeft :: Boolean
//.
//. `true` if `this` is a Left; `false` if `this` is a Right.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero').isLeft
//. true
//.
//. > S.Right(42).isLeft
//. false
//. ```

//# Either#isRight :: Boolean
//.
//. `true` if `this` is a Right; `false` if `this` is a Left.
//.
//. ```javascript
//. > S.Right(42).isRight
//. true
//.
//. > S.Left('Cannot divide by zero').isRight
//. false
//. ```

//# Either#ap :: Either a (b -> c) ~> Either a b -> Either a c
//.
//. Takes a value of type `Either a b` and returns a Left unless `this`
//. is a Right *and* the argument is a Right, in which case it returns
//. a Right whose value is the result of applying this Right's value to
//. the given Right's value.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero').ap(S.Right(42))
//. Left('Cannot divide by zero')
//.
//. > S.Right(S.inc).ap(S.Left('Cannot divide by zero'))
//. Left('Cannot divide by zero')
//.
//. > S.Right(S.inc).ap(S.Right(42))
//. Right(43)
//. ```
Either.prototype.ap =
method('Either#ap',
       {},
       [$Either(a, $.Function), $Either(a, b), $Either(a, c)],
       function(ef, ex) { return ef.isRight ? ex.map(ef.value) : ef; });

//# Either#chain :: Either a b ~> (b -> Either a c) -> Either a c
//.
//. Takes a function and returns `this` if `this` is a Left; otherwise
//. it returns the result of applying the function to this Right's value.
//.
//. ```javascript
//. > global.sqrt = n =>
//. .   n < 0 ? S.Left('Cannot represent square root of negative number')
//. .         : S.Right(Math.sqrt(n))
//. sqrt
//.
//. > S.Left('Cannot divide by zero').chain(sqrt)
//. Left('Cannot divide by zero')
//.
//. > S.Right(-1).chain(sqrt)
//. Left('Cannot represent square root of negative number')
//.
//. > S.Right(25).chain(sqrt)
//. Right(5)
//. ```
Either.prototype.chain =
method('Either#chain',
       {},
       [$Either(a, b), $.Function, $Either(a, c)],
       function(either, f) {
         return either.isRight ? f(either.value) : either;
       });

//# Either#concat :: (Semigroup a, Semigroup b) => Either a b ~> Either a b -> Either a b
//.
//. Returns the result of concatenating two Either values of the same type.
//. `a` must have a [Semigroup][] (indicated by the presence of a `concat`
//. method), as must `b`.
//.
//. If `this` is a Left and the argument is a Left, this method returns a
//. Left whose value is the result of concatenating this Left's value and
//. the given Left's value.
//.
//. If `this` is a Right and the argument is a Right, this method returns a
//. Right whose value is the result of concatenating this Right's value and
//. the given Right's value.
//.
//. Otherwise, this method returns the Right.
//.
//. ```javascript
//. > S.Left('abc').concat(S.Left('def'))
//. Left('abcdef')
//.
//. > S.Right([1, 2, 3]).concat(S.Right([4, 5, 6]))
//. Right([1, 2, 3, 4, 5, 6])
//.
//. > S.Left('abc').concat(S.Right([1, 2, 3]))
//. Right([1, 2, 3])
//.
//. > S.Right([1, 2, 3]).concat(S.Left('abc'))
//. Right([1, 2, 3])
//. ```
Either.prototype.concat =
method('Either#concat',
       {a: [Semigroup], b: [Semigroup]},
       [$Either(a, b), $Either(a, b), $Either(a, b)],
       function(ex, ey) {
         return ex.isLeft && ey.isLeft ? Left(ex.value.concat(ey.value)) :
                ex.isRight && ey.isRight ? Right(ex.value.concat(ey.value)) :
                ex.isRight ? ex : ey;
       });

//# Either#equals :: Either a b ~> c -> Boolean
//.
//. Takes a value of any type and returns `true` if:
//.
//.   - it is a Left and `this` is a Left, and their values are equal
//.     according to [`R.equals`][R.equals]; or
//.
//.   - it is a Right and `this` is a Right, and their values are equal
//.     according to [`R.equals`][R.equals].
//.
//. ```javascript
//. > S.Right([1, 2, 3]).equals(S.Right([1, 2, 3]))
//. true
//.
//. > S.Right([1, 2, 3]).equals(S.Left([1, 2, 3]))
//. false
//.
//. > S.Right(42).equals(42)
//. false
//. ```
Either.prototype.equals =
method('Either#equals',
       {},
       [$Either(a, b), c, $.Boolean],
       function(either, x) {
         return _type(x) === 'sanctuary/Either' &&
                either.isLeft === x.isLeft && R.eqProps('value', either, x);
       });

//# Either#extend :: Either a b ~> (Either a b -> b) -> Either a b
//.
//. Takes a function and returns `this` if `this` is a Left; otherwise it
//. returns a Right whose value is the result of applying the function to
//. `this`.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero').extend(x => x.value + 1)
//. Left('Cannot divide by zero')
//.
//. > S.Right(42).extend(x => x.value + 1)
//. Right(43)
//. ```
Either.prototype.extend =
method('Either#extend',
       {},
       [$Either(a, b), $.Function, $Either(a, b)],
       function(either, f) {
         return either.isLeft ? either : Right(f(either));
       });

//# Either#map :: Either a b ~> (b -> c) -> Either a c
//.
//. Takes a function and returns `this` if `this` is a Left; otherwise it
//. returns a Right whose value is the result of applying the function to
//. this Right's value.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero').map(S.inc)
//. Left('Cannot divide by zero')
//.
//. > S.Right([1, 2, 3]).map(S.sum)
//. Right(6)
//. ```
Either.prototype.map =
method('Either#map',
       {},
       [$Either(a, b), $.Function, $Either(a, c)],
       function(either, f) {
         return either.isRight ? Right(f(either.value)) : either;
       });

//# Either#of :: Either a b ~> c -> Either a c
//.
//. Takes a value of any type and returns a Right with the given value.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero').of(42)
//. Right(42)
//. ```
Either.prototype.of =
def('Either#of',
    {},
    [c, $Either(a, c)],
    Either.of);

//# Either#reduce :: Either a b ~> ((c, b) -> c) -> c -> c
//.
//. Takes a function and an initial value of any type, and returns:
//.
//.   - the initial value if `this` is a Left; otherwise
//.
//.   - the result of applying the function to the initial value and this
//.     Right's value.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero').reduce((xs, x) => xs.concat([x]), [42])
//. [42]
//.
//. > S.Right(5).reduce((xs, x) => xs.concat([x]), [42])
//. [42, 5]
//. ```
Either.prototype.reduce =
method('Either#reduce',
       {},
       [$Either(a, b), $.Function, c, c],
       function(either, f, x) {
         return either.isRight ? f(x, either.value) : x;
       });

//# Either#sequence :: Applicative f => Either a (f b) ~> (b -> f b) -> f (Either a b)
//.
//. Evaluates an applicative action contained within the Either,
//. resulting in:
//.
//.   - a pure applicative of a Left if `this` is a Left; otherwise
//.
//.   - an applicative of a Right of the evaluated action.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero').sequence(S.Maybe.of)
//. Just(Left('Cannot divide by zero'))
//.
//. > S.Right(S.Just(42)).sequence(S.Maybe.of)
//. Just(Right(42))
//.
//. > S.Right(S.Nothing).sequence(S.Maybe.of)
//. Nothing
//. ```
Either.prototype.sequence =
method('Either#sequence',
       {b: [Applicative], c: [Applicative]},
       [$Either(a, b), $.Function, c],
       function(either, of) {
         return either.isRight ? R.map(Right, either.value) : of(either);
       });

//# Either#toBoolean :: Either a b ~> Boolean
//.
//. Returns `false` if `this` is a Left; `true` if `this` is a Right.
//.
//. ```javascript
//. > S.Left(42).toBoolean()
//. false
//.
//. > S.Right(42).toBoolean()
//. true
//. ```
Either.prototype.toBoolean =
method('Either#toBoolean',
       {},
       [$Either(a, b), $.Boolean],
       prop('isRight'));

//# Either#toString :: Either a b ~> String
//.
//. Returns the string representation of the Either.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero').toString()
//. 'Left("Cannot divide by zero")'
//.
//. > S.Right([1, 2, 3]).toString()
//. 'Right([1, 2, 3])'
//. ```
Either.prototype.toString =
method('Either#toString',
       {},
       [$Either(a, b), $.String],
       function(either) {
         return (either.isLeft ? 'Left' : 'Right') +
                '(' + R.toString(either.value) + ')';
       });

//# Either#inspect :: Either a b ~> String
//.
//. Returns the string representation of the Either. This method is used by
//. `util.inspect` and the REPL to format a Either for display.
//.
//. See also [`Either#toString`](#Either.prototype.toString).
//.
//. ```javascript
//. > S.Left('Cannot divide by zero').inspect()
//. 'Left("Cannot divide by zero")'
//.
//. > S.Right([1, 2, 3]).inspect()
//. 'Right([1, 2, 3])'
//. ```
Either.prototype.inspect = inspect;

//# Left :: a -> Either a b
//.
//. Takes a value of any type and returns a Left with the given value.
//.
//. ```javascript
//. > S.Left('Cannot divide by zero')
//. Left('Cannot divide by zero')
//. ```
export const Left = function(value) {
  var left = new Either(sentinel);
  left.isLeft = true;
  left.isRight = false;
  left.value = value;
  return left;
};

//# Right :: b -> Either a b
//.
//. Takes a value of any type and returns a Right with the given value.
//.
//. ```javascript
//. > S.Right(42)
//. Right(42)
//. ```
export const Right = function(value) {
  var right = new Either(sentinel);
  right.isLeft = false;
  right.isRight = true;
  right.value = value;
  return right;
};
