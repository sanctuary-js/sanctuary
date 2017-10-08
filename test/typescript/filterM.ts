import {Just, Nothing, filterM, odd} from '../..';

// $ExpectType number[]
filterM(odd)([]);

// $ExpectType number[]
filterM(odd)([1, 2, 3]);

// $ExpectError Argument of type '(n: number) => 0' is not assignable to parameter of type 'Predicate<number>'.
filterM((n: number) => 0)([1, 2, 3]);

// $ExpectType Foldable<number>
filterM(odd)(Nothing);

// $ExpectType Foldable<number>
filterM(odd)(Just(1));
