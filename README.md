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

As mentioned, Sanctuary provides several `null`-safe functions for interacting with objects and lists, they are as follows:

##### Objects
`get :: String -> Object -> Maybe *`

Returns a `Just` containing the value found at the specified key or a `Nothing` if the value is not found.
```javascript
S.get('a', {a: 1, b: 2}) // => Just(1)
S.get('c', {a: 1, b: 2}) // => Nothing()
```

##### Lists
`at :: Number -> [a] -> Maybe a`

Returns a `Just` containing the item at the index specified or a `Nothing` if the index is not found.
```javascript
S.at(1, [0, 1, 2, 3, 4]) // => Just(1)
S.at(6, [0, 1, 2, 3, 4]) // => Nothing()
```

`head :: [a] -> Maybe a`

Returns a `Just` containing the first item in the list or a `Nothing` if the list is empty.
```javascript
S.head([0, 1, 2, 3, 4]) // => Just(0)
S.head([]) // => Nothing()
```

`last :: [a] -> Maybe a`

Returns a `Just` containing the final item in the list or a `Nothing` if the list is empty.
```javascript
S.last([0, 1, 2, 3, 4]) // => Just(4)
S.last([]) // => Nothing()
```

`tail :: [a] -> Maybe [a]`

Returns a `Just` containing a list with all but the first element in the original list or a `Nothing` that list is empty.
```javascript
S.tail([0, 1, 2, 3, 4]) // => Just([1, 2, 3, 4])
S.tail([]) // => Nothing()
```

`init :: [a] -> Maybe [a]`

Returns a `Just` containing a list with all but the last element in the original list or a `Nothing` that list is empty.
```javascript
S.init([0, 1, 2, 3, 4]) // => Just([0, 1, 2, 3])
S.init([]) // => Nothing()
```

`find :: (a -> Boolean) -> [a] -> Maybe a`

Return a `Just` containing the first element in the list that satisfies the supplied predicate function or a `Nothing` if the item is not found.
```javascript
S.find(function (x) {
    return x === 4
}, [0, 1, 2, 3, 4]) // => Just(4)

S.find(function (x) {
    return x === 4
}, [0, 1, 2, 3]) // => Nothing()
```

Sanctuary also provide `null`-safe functions for parsing various inputs:

`parseDate :: String -> Maybe Date`

Returns a `Just` containing a Javascript date object if the date is valid or a `Nothing` otherwise.
```javascript
S.parseDate('2011-01-19T17:40:00Z') // => Just('Sun Jun 19 2011 19:40:00 GMT+0100 (BST)')
S.parseDate('2015-02-31T17:40:00Z') // => Nothing()
```

`parseFloat :: String -> Maybe Number`

Returns a `Just` containing the parsed float or a `Nothing` if the provided string is an invalid number.
```javascript
S.parseFloat('3.14') // => Just(3.14)
S.parseFloat('pi') // => Nothing()
```

`parseInt :: Number -> String -> Maybe Number`

Returns a `Just` containing the parsed integer in the specified base notation or a `Nothing` if the provided string is an invalid number.
```javascript
S.parseInt(10, '42') // => Just(42)
S.parseInt(16, '2A') // => Just(42)
S.parseInt(10, 'xxx') // => Nothing()
```

`parseJson :: String -> Maybe`

Returns a `Just` containing the parsed JSON if it is valid or a `Nothing` otherwise.
```javascript
S.parseJson('["foo","bar"]') // => Just(["foo","bar"])
S.parseJson('zzzz') // => Nothing()
```

[1]: http://ramdajs.com/