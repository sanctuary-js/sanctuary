import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import fromEither from 'sanctuary/fromEither';


test ('fromEither', () => {

  eq (S.fromEither === fromEither, true);
  eq (String (S.fromEither), 'fromEither :: Either a a -> a');

  eq (S.fromEither (S.Left (42)), 42);
  eq (S.fromEither (S.Right (42)), 42);

});
