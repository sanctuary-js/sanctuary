import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('maybeToNullable', () => {

  eq (String (S.maybeToNullable), 'maybeToNullable :: Maybe a -> Nullable a');

  eq (S.maybeToNullable (S.Nothing), null);
  eq (S.maybeToNullable (S.Just (42)), 42);

});
