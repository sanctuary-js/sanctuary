import {flip} from '../..';

const concat = (a: string) => (b: string) => a + b;

// $ExpectType string
flip(concat)('foo')('bar');
