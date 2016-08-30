
//. ### Maybe type

//. The Maybe type represents optional values: a value of type `Maybe a` is
//. either a Just whose value is of type `a` or Nothing (with no value).
//.
//. The Maybe type satisfies the [Monoid][], [Monad][], [Traversable][],
//. and [Extend][] specifications.

//# MaybeType :: Type -> Type
//.
//. A [`UnaryType`][UnaryType] for use with [sanctuary-def][].
//

export { encase } from './encase'
export { encase2 } from './encase2'
export { encase3 } from './encase3'
export { fromMaybe } from './fromMaybe'
export { isJust } from './isJust'
export { isNothing } from './isNothing'
export { justs } from './justs'
export { mapMaybe } from './mapMaybe'
export { maybe } from './_maybe'
export { Maybe, Just, Nothing } from './Maybe'
export { maybeToEither } from './maybeToEither'
export { maybeToNullable } from './maybeToNullable'
export { toMaybe } from './toMaybe'
