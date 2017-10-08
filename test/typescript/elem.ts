import {elem} from '../..';

// $ExpectType boolean
elem('foo')(['foo', 'bar']);

// $ExpectType boolean
elem('foo')({a: 'foo', b: 'bar'});

// $ExpectType boolean
elem(1)(['foo', 'bar']);

// $ExpectType boolean
elem(1)({a: 'foo', b: 'bar'});
