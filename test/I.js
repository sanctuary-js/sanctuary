import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import I from 'sanctuary/I';


test ('I', () => {

  eq (S.I === I, true);
  eq (String (S.I), 'I :: a -> a');

  eq (S.I ([1, 2, 3]), [1, 2, 3]);
  eq (S.I (['foo', 42]), ['foo', 42]);

  const x = Symbol ('x');
  eq (S.I (x) === x, true);

});
