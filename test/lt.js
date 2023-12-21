import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('lt', () => {

  eq (String (S.lt), 'lt :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.lt (3)) ([1, 2, 3, 4, 5]), [1, 2]);

});
