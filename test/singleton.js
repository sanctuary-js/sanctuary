import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('singleton', () => {

  eq (String (S.singleton), 'singleton :: String -> a -> StrMap a');

  eq (S.singleton ('foo') (42), {foo: 42});

});
