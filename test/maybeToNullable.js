import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import maybeToNullable from 'sanctuary/maybeToNullable';


test ('maybeToNullable', () => {

  eq (S.maybeToNullable === maybeToNullable, true);
  eq (String (S.maybeToNullable), 'maybeToNullable :: Maybe a -> Nullable a');

  eq (S.maybeToNullable (S.Nothing), null);
  eq (S.maybeToNullable (S.Just (42)), 42);

});
