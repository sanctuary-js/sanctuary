import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('elem', () => {

  eq (String (S.elem), 'elem :: (Setoid a, Foldable f) => a -> f a -> Boolean');

  eq (S.elem ('c') (['a', 'b', 'c']), true);
  eq (S.elem ('x') (['a', 'b', 'c']), false);
  eq (S.elem (3) ({x: 1, y: 2, z: 3}), true);
  eq (S.elem (8) ({x: 1, y: 2, z: 3}), false);
  eq (S.elem (0) (S.Just (0)), true);
  eq (S.elem (0) (S.Just (1)), false);
  eq (S.elem (0) (S.Nothing), false);

});
