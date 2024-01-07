import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('maybe', () => {

  eq (String (S.maybe), 'maybe :: b -> (a -> b) -> Maybe a -> b');

  eq (S.maybe (0) (Math.sqrt) (S.Nothing), 0);
  eq (S.maybe (0) (Math.sqrt) (S.Just (9)), 3);

});
