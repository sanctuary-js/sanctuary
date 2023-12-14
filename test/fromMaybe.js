import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import fromMaybe from 'sanctuary/fromMaybe';


test ('fromMaybe', () => {

  eq (S.fromMaybe === fromMaybe, true);
  eq (String (S.fromMaybe), 'fromMaybe :: a -> Maybe a -> a');

  eq (S.fromMaybe (0) (S.Nothing), 0);
  eq (S.fromMaybe (0) (S.Just (42)), 42);

});
