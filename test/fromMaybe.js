import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('fromMaybe', () => {

  eq (String (S.fromMaybe), 'fromMaybe :: a -> Maybe a -> a');

  eq (S.fromMaybe (0) (S.Nothing), 0);
  eq (S.fromMaybe (0) (S.Just (42)), 42);

});
