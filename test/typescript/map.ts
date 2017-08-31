import * as S from '../..';

// $ExpectType number[]
S.map(n => n * 2, [1, 2, 3]);

// $ExpectError The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.
S.map(n => n * 2, ['foo', 1, 2]);
