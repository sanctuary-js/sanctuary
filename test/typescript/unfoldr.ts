import {unfoldr, Just, Nothing} from '../..';

// $ExpectType number[]
unfoldr<number, number>((n: number) => n < 5 ? Just([n, n + 1]) : Nothing)(1);

// Implicit generic doesn't narrow much. Not ideal.
// $ExpectType {}[]
unfoldr((n: number) => n < 5 ? Just([n, n + 1]) : Nothing)(1);
