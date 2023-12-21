import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('reduce_', () => {

  eq (String (S.reduce_), 'reduce_ :: Foldable f => (a -> b -> b) -> b -> f a -> b');

  eq (S.reduce_ (S.append) ([]) ([]), []);
  eq (S.reduce_ (S.append) ([]) ([1, 2, 3]), [1, 2, 3]);
  eq (S.reduce_ (S.prepend) ([]) ([]), []);
  eq (S.reduce_ (S.prepend) ([]) ([1, 2, 3]), [3, 2, 1]);

});
