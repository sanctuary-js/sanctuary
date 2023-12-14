import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import tagBy from 'sanctuary/tagBy';


test ('tagBy', () => {

  eq (S.tagBy === tagBy, true);
  eq (String (S.tagBy), 'tagBy :: (a -> Boolean) -> a -> Either a a');

  eq (S.tagBy (S.odd) (5), S.Right (5));
  eq (S.tagBy (S.odd) (6), S.Left (6));

});
