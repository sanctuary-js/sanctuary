import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import K from 'sanctuary/K';


test ('K', () => {

  eq (S.K === K, true);
  eq (String (S.K), 'K :: a -> b -> a');

  eq (S.K (21) ([]), 21);
  eq (S.K (42) (null), 42);
  eq (S.K (84) (undefined), 84);

});
