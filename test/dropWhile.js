import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('dropWhile', () => {

  eq (String (S.dropWhile), 'dropWhile :: (a -> Boolean) -> Array a -> Array a');

  eq (S.dropWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4]), [6, 3, 5, 4]);
  eq (S.dropWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4]), [3, 3, 3, 7, 6, 3, 5, 4]);
  eq (S.dropWhile (S.odd) ([]), []);

});
