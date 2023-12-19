'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('elem_', () => {

  eq (String (S.elem_)) ('elem_ :: (Setoid a, Foldable f) => f a -> a -> Boolean');

  eq (S.elem_ (['a', 'b', 'c']) ('c')) (true);
  eq (S.elem_ (['a', 'b', 'c']) ('x')) (false);
  eq (S.elem_ ({x: 1, y: 2, z: 3}) (3)) (true);
  eq (S.elem_ ({x: 1, y: 2, z: 3}) (8)) (false);
  eq (S.elem_ (S.Just (0)) (0)) (true);
  eq (S.elem_ (S.Just (1)) (0)) (false);
  eq (S.elem_ (S.Nothing) (0)) (false);

});
