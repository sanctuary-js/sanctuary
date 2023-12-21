import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('stripPrefix', () => {

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
