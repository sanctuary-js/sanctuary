import {groupBy} from '../..';

// $ExpectType number[][]
groupBy((x: number) => (y: number) => x + y === 0)([2, -3, 3, 3, 3, 4, -4, 4]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
groupBy((x: number) => (y: number) => x + y === 0)([2, -3, 3, 3, 'foo', 4, -4, 4]);
