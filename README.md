# Sanctuary

Sanctuary is small functional programming library inspired by Haskell and
PureScript. Sanctuary makes it possible to write safe code without null checks.

In JavaScript it's trivial to introduce a possible run-time type error:

```javascript
words[0].toUpperCase()
```

If `words` is `['foo', 'bar', 'baz']` this expression will evaluate to `'FOO'`.
But what if `words` is `[]`?

Sanctuary is stricter in its types than most JavaScript libraries. Its `head`
function, for example, has type `a -> Maybe a` which means it never returns
null or undefined. This forces one to consider the empty case.

`S.head(words)` evaluates to a value of type `Maybe String`. One may derive
from it a value of type `String` by applying `S.fromMaybe`. The `toUpperCase`
method can then be invoked safely:

```javascript
// :: String
S.fromMaybe('', S.head(words)).toUpperCase()
```

Without Sanctuary, one might have written:

```javascript
// :: String
(words.length > 0 ? words[0] : '').toUpperCase()
```

Maybe is a functor, so one can use its `map` method to produce another Maybe:

```javascript
// :: Maybe String
S.head(words).map(function(word) { return word.toUpperCase(); })
```

This approach is even cleaner if one uses [Ramda][1]:

```javascript
// :: Maybe String
R.map(R.toUpper, S.head(words))
```


[1]: http://ramdajs.com/
