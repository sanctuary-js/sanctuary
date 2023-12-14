import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import maybe from 'sanctuary/maybe';


test ('maybe', () => {

  eq (S.maybe === maybe, true);
  eq (String (S.maybe), 'maybe :: b -> (a -> b) -> Maybe a -> b');

  eq (S.maybe (0) (Math.sqrt) (S.Nothing), 0);
  eq (S.maybe (0) (Math.sqrt) (S.Just (9)), 3);

});
