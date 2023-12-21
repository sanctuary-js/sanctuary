import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('apFirst', () => {

  eq (String (S.apFirst), 'apFirst :: Apply f => f a -> f b -> f a');

  eq (S.apFirst ([1, 2]) ([3, 4]), [1, 1, 2, 2]);
  eq (S.apFirst (S.Just (1)) (S.Just (2)), S.Just (1));

});
