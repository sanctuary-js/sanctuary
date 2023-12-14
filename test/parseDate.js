import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import parseDate from 'sanctuary/parseDate';


test ('parseDate', () => {

  eq (S.parseDate === parseDate, true);
  eq (String (S.parseDate), 'parseDate :: String -> Maybe ValidDate');

  eq (S.parseDate ('2001-02-03T04:05:06Z'), S.Just (new Date ('2001-02-03T04:05:06Z')));
  eq (S.parseDate ('today'), S.Nothing);

});
