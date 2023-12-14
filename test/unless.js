import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import unless from 'sanctuary/unless';


test ('unless', () => {

  eq (S.unless === unless, true);
  eq (String (S.unless), 'unless :: (a -> Boolean) -> (a -> a) -> a -> a');

  eq (S.unless (S.lt (0)) (Math.sqrt) (16), 4);
  eq (S.unless (S.lt (0)) (Math.sqrt) (-1), -1);

});
