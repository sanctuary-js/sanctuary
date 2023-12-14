import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import singleton from 'sanctuary/singleton';


test ('singleton', () => {

  eq (S.singleton === singleton, true);
  eq (String (S.singleton), 'singleton :: String -> a -> StrMap a');

  eq (S.singleton ('foo') (42), {foo: 42});

});
