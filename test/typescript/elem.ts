import {elem} from '../..';

// $ExpectType boolean
elem('foo')(['foo', 'bar']);

// $ExpectType boolean
elem('foo')({a: 'foo', b: 'bar'});

// $ExpectError Argument of type 'string[]' is not assignable to parameter of type 'number[] | { [s: string]: number; }'.
elem(1)(['foo', 'bar']);

// $ExpectError Argument of type '{ a: string; b: string; }' is not assignable to parameter of type 'number[] | { [s: string]: number; }'.
elem(1)({a: 'foo', b: 'bar'});
