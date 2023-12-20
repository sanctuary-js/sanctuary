import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('findMap', () => {

  eq (String (S.findMap), 'findMap :: Foldable f => (a -> Maybe b) -> f a -> Maybe b');

  eq (S.findMap (S.parseInt (16)) ([]), S.Nothing);
  eq (S.findMap (S.parseInt (16)) (['H', 'G']), S.Nothing);
  eq (S.findMap (S.parseInt (16)) (['H', 'G', 'F', 'E']), S.Just (15));
  eq (S.findMap (S.parseInt (16)) ({}), S.Nothing);
  eq (S.findMap (S.parseInt (16)) ({a: 'H', b: 'G'}), S.Nothing);
  eq (S.findMap (S.parseInt (16)) ({a: 'H', b: 'G', c: 'F', d: 'E'}), S.Just (15));

});
