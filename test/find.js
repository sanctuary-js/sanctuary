import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('find', () => {

  eq (String (S.find), 'find :: Foldable f => (a -> Boolean) -> f a -> Maybe a');

  eq (S.find (S.even) ([]), S.Nothing);
  eq (S.find (S.even) ([1, 3, 5, 7, 9]), S.Nothing);
  eq (S.find (S.even) ([1, 2, 3, 4, 5]), S.Just (2));
  eq (S.find (S.even) ({}), S.Nothing);
  eq (S.find (S.even) ({a: 1, b: 3, c: 5, d: 7, e: 9}), S.Nothing);
  eq (S.find (S.even) ({a: 1, b: 2, c: 3, d: 4, e: 5}), S.Just (2));
  eq (S.find (S.even) ({e: 5, d: 4, c: 3, b: 2, a: 1}), S.Just (2));

});
