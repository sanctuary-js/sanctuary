import {reverse} from '../..';

// $ExpectType string
reverse('foo');

// $ExpectType number[]
reverse([1, 2, 3]);

// $ExpectType never[]
reverse([]);
