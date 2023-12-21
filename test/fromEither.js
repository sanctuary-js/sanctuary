import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('fromEither', () => {

  eq (String (S.fromEither), 'fromEither :: Either a a -> a');

  eq (S.fromEither (S.Left (42)), 42);
  eq (S.fromEither (S.Right (42)), 42);

});
