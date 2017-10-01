import {flip_} from '../..';

function concat(a: string, b: string): string {
  return a + b;
}

// $ExpectType string
flip_(concat)('foo')('bar');
