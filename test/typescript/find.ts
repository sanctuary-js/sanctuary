import {find, odd} from '../..';

// $ExpectType Maybe<number>
find(odd)([1, 2, 3]);

// $ExpectError Argument of type 'string[]' is not assignable to parameter of type 'number[] | Foldable<number> | StrMap<number>'.
find(odd)(['foo', 'bar']);
