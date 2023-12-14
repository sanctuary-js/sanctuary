import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import contramap from 'sanctuary/contramap';


test ('contramap', () => {

  eq (S.contramap === contramap, true);
  eq (String (S.contramap), 'contramap :: Contravariant f => (b -> a) -> f a -> f b');

  eq (S.contramap (S.prop ('length')) (Math.sqrt) ('Sanctuary'), 3);

});
