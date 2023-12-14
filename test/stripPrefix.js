import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import stripPrefix from 'sanctuary/stripPrefix';


test ('stripPrefix', () => {

  eq (S.stripPrefix === stripPrefix, true);
  eq (String (S.stripPrefix), 'stripPrefix :: String -> String -> Maybe String');

  eq (S.stripPrefix ('') (''), S.Just (''));
  eq (S.stripPrefix ('') ('abc'), S.Just ('abc'));
  eq (S.stripPrefix ('a') (''), S.Nothing);
  eq (S.stripPrefix ('a') ('abc'), S.Just ('bc'));
  eq (S.stripPrefix ('a') ('[abc]'), S.Nothing);
  eq (S.stripPrefix ('aaa') ('a'), S.Nothing);
  eq (S.stripPrefix ('https://') ('https://sanctuary.js.org'), S.Just ('sanctuary.js.org'));
  eq (S.stripPrefix ('https://') ('http://sanctuary.js.org'), S.Nothing);

});
