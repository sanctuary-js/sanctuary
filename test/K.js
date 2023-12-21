import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('K', () => {

  eq (String (S.K), 'K :: a -> b -> a');

  eq (S.K (21) ([]), 21);
  eq (S.K (42) (null), 42);
  eq (S.K (84) (undefined), 84);

});
