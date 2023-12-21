import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('stripSuffix', () => {

  eq (String (S.stripSuffix), 'stripSuffix :: String -> String -> Maybe String');

  eq (S.stripSuffix ('') (''), S.Just (''));
  eq (S.stripSuffix ('') ('xyz'), S.Just ('xyz'));
  eq (S.stripSuffix ('z') (''), S.Nothing);
  eq (S.stripSuffix ('z') ('xyz'), S.Just ('xy'));
  eq (S.stripSuffix ('z') ('[xyz]'), S.Nothing);
  eq (S.stripSuffix ('zzz') ('z'), S.Nothing);
  eq (S.stripSuffix ('.md') ('README.md'), S.Just ('README'));
  eq (S.stripSuffix ('.md') ('README'), S.Nothing);

});
