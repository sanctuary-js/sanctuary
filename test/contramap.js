import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('contramap', () => {

  eq (String (S.contramap), 'contramap :: Contravariant f => (b -> a) -> f a -> f b');

  eq (S.contramap (S.prop ('length')) (Math.sqrt) ('Sanctuary'), 3);

});
