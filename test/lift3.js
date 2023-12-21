import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';

import area from './internal/area.js';


test ('lift3', () => {

  eq (String (S.lift3), 'lift3 :: Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d');

  eq (S.lift3 (S.reduce) (S.Just (S.add)) (S.Just (0)) (S.Just ([1, 2, 3])), S.Just (6));
  eq (S.lift3 (S.reduce) (S.Just (S.add)) (S.Just (0)) (S.Nothing), S.Nothing);

  eq (S.lift3 (S.reduce) (S.Right (S.add)) (S.Right (0)) (S.Right ([1, 2, 3])), S.Right (6));
  eq (S.lift3 (S.reduce) (S.Right (S.add)) (S.Right (0)) (S.Left ('WHOOPS')), S.Left ('WHOOPS'));

  eq (S.lift3 (S.reduce) ([S.add]) ([0]) ([[1, 2, 3]]), [6]);
  eq (S.lift3 (S.reduce) ([S.add]) ([0]) ([]), []);

  eq (S.lift3 (area) (S.sub (1)) (S.I) (S.add (1)) (4), 6);

});
