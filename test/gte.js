import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('gte', () => {

  eq (String (S.gte), 'gte :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.gte (3)) ([1, 2, 3, 4, 5]), [3, 4, 5]);

});
