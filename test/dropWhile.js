import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import dropWhile from 'sanctuary/dropWhile';


test ('dropWhile', () => {

  eq (S.dropWhile === dropWhile, true);
  eq (String (S.dropWhile), 'dropWhile :: (a -> Boolean) -> Array a -> Array a');

  eq (S.dropWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4]), [6, 3, 5, 4]);
  eq (S.dropWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4]), [3, 3, 3, 7, 6, 3, 5, 4]);
  eq (S.dropWhile (S.odd) ([]), []);

});
